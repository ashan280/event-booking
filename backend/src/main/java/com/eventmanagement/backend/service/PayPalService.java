package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.BookingDto;
import com.eventmanagement.backend.dto.PaymentDto;
import com.eventmanagement.backend.model.Booking;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.BookingRepository;
import com.eventmanagement.backend.repository.EventRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@Slf4j
@RequiredArgsConstructor
public class PayPalService {

    private static final BigDecimal MINIMUM_PAYPAL_AMOUNT = new BigDecimal("0.01");
    private static final Duration PAYPAL_TIMEOUT = Duration.ofSeconds(20);

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;
    private final AuthService authService;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newBuilder()
        .connectTimeout(PAYPAL_TIMEOUT)
        .followRedirects(HttpClient.Redirect.NORMAL)
        .version(HttpClient.Version.HTTP_1_1)
        .build();

    @Value("${app.paypal.base-url:https://api-m.sandbox.paypal.com}")
    private String payPalBaseUrl;

    @Value("${app.paypal.client-id:}")
    private String payPalClientId;

    @Value("${app.paypal.client-secret:}")
    private String payPalClientSecret;

    @Value("${app.paypal.currency:AUD}")
    private String payPalCurrency;

    public PaymentDto.PayPalConfigResponse getConfig() {
        boolean enabled = isConfigured();
        String note = enabled
            ? "PayPal Sandbox is ready for this booking."
            : "Add PayPal Sandbox client ID and secret to enable the PayPal test button.";

        return new PaymentDto.PayPalConfigResponse(
            enabled,
            enabled ? payPalClientId : "",
            payPalCurrency,
            note
        );
    }

    public PaymentDto.PayPalOrderResponse createOrder(HttpServletRequest request, BookingDto.BookingRequest bookingRequest) {
        ensureConfigured();
        ValidatedPayPalBooking validatedBooking = validateBookingRequest(request, bookingRequest);
        String accessToken = getAccessToken();

        try {
            String responseBody = objectMapper.writeValueAsString(buildCreateOrderPayload(validatedBooking));
            HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(payPalBaseUrl + "/v2/checkout/orders"))
                .timeout(PAYPAL_TIMEOUT)
                .header("Authorization", "Bearer " + accessToken)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(responseBody))
                .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            JsonNode jsonNode = parseJson(response.body());

            if (response.statusCode() >= 400) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    extractPayPalMessage(jsonNode, "PayPal order could not be created")
                );
            }

            String orderId = jsonNode.path("id").asText();

            if (orderId.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PayPal order could not be created");
            }

            return new PaymentDto.PayPalOrderResponse(orderId, payPalCurrency, validatedBooking.totalAmount());
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            log.warn("PayPal order creation failed: {}", getErrorSummary(exception), exception);
            throw new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "PayPal order could not be created. " + getErrorSummary(exception)
            );
        }
    }

    public PaymentDto.PayPalCaptureResponse captureOrder(
        HttpServletRequest request,
        String orderId,
        BookingDto.BookingRequest bookingRequest
    ) {
        ensureConfigured();
        ValidatedPayPalBooking validatedBooking = validateBookingRequest(request, bookingRequest);
        String accessToken = getAccessToken();

        try {
            HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(payPalBaseUrl + "/v2/checkout/orders/" + orderId + "/capture"))
                .timeout(PAYPAL_TIMEOUT)
                .header("Authorization", "Bearer " + accessToken)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("{}"))
                .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            JsonNode jsonNode = parseJson(response.body());

            if (response.statusCode() >= 400) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    extractPayPalMessage(jsonNode, "PayPal payment could not be captured")
                );
            }

            String status = jsonNode.path("status").asText();

            if (!"COMPLETED".equalsIgnoreCase(status)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PayPal payment is not completed yet");
            }

            String captureId = jsonNode.path("purchase_units")
                .path(0)
                .path("payments")
                .path("captures")
                .path(0)
                .path("id")
                .asText("");

            BookingDto.BookingResponse booking = bookingService.createBookingForUser(
                validatedBooking.user(),
                bookingRequest,
                "PayPal"
            );

            return new PaymentDto.PayPalCaptureResponse(captureId, status, booking);
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            log.warn("PayPal payment capture failed: {}", getErrorSummary(exception), exception);
            throw new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "PayPal payment could not be captured. " + getErrorSummary(exception)
            );
        }
    }

    private String getAccessToken() {
        try {
            String credentials = payPalClientId + ":" + payPalClientSecret;
            String encodedCredentials = Base64.getEncoder()
                .encodeToString(credentials.getBytes(StandardCharsets.UTF_8));

            HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(payPalBaseUrl + "/v1/oauth2/token"))
                .timeout(PAYPAL_TIMEOUT)
                .header("Authorization", "Basic " + encodedCredentials)
                .header("Accept", "application/json")
                .header("Accept-Language", "en_US")
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString("grant_type=client_credentials"))
                .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            JsonNode jsonNode = parseJson(response.body());

            if (response.statusCode() >= 400) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    extractPayPalMessage(jsonNode, "PayPal access token could not be created")
                );
            }

            String accessToken = jsonNode.path("access_token").asText();

            if (accessToken.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "PayPal access token could not be created");
            }

            return accessToken;
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            log.warn("PayPal access token request failed: {}", getErrorSummary(exception), exception);
            throw new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "PayPal access token could not be created. " + getErrorSummary(exception)
            );
        }
    }

    private JsonNode buildCreateOrderPayload(ValidatedPayPalBooking validatedBooking) {
        var rootNode = objectMapper.createObjectNode();
        rootNode.put("intent", "CAPTURE");

        var paymentSourceNode = rootNode.putObject("payment_source");
        var paypalNode = paymentSourceNode.putObject("paypal");
        var experienceContextNode = paypalNode.putObject("experience_context");
        experienceContextNode.put("shipping_preference", "NO_SHIPPING");
        experienceContextNode.put("user_action", "PAY_NOW");

        var purchaseUnitNode = rootNode.putArray("purchase_units").addObject();
        purchaseUnitNode.put("description", buildDescription(validatedBooking));
        purchaseUnitNode.put("custom_id", buildCustomId(validatedBooking));

        var amountNode = purchaseUnitNode.putObject("amount");
        amountNode.put("currency_code", payPalCurrency);
        amountNode.put("value", validatedBooking.totalAmount().setScale(2, RoundingMode.HALF_UP).toPlainString());

        return rootNode;
    }

    private ValidatedPayPalBooking validateBookingRequest(
        HttpServletRequest request,
        BookingDto.BookingRequest bookingRequest
    ) {
        User user = authService.getCurrentUser(request);
        Event event = eventRepository.findById(bookingRequest.getEventId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        List<String> selectedSeats = cleanSeatLabels(bookingRequest.getSeatLabels());

        if (isFreeEvent(event.getPrice())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Free events do not need PayPal payment");
        }

        if (event.getAvailableSeats() < bookingRequest.getSeatCount()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough seats");
        }

        if (selectedSeats.size() != bookingRequest.getSeatCount()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Select the same number of seats");
        }

        Set<String> bookedSeats = getBookedSeatSet(event.getId());

        for (String seatLabel : selectedSeats) {
            if (bookedSeats.contains(seatLabel)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Some seats are already booked");
            }
        }

        BigDecimal totalAmount = parsePrice(event.getPrice()).multiply(BigDecimal.valueOf(bookingRequest.getSeatCount()));

        if (totalAmount.compareTo(MINIMUM_PAYPAL_AMOUNT) < 0) {
            totalAmount = MINIMUM_PAYPAL_AMOUNT;
        }

        return new ValidatedPayPalBooking(user, event, selectedSeats, totalAmount);
    }

    private Set<String> getBookedSeatSet(Long eventId) {
        return new LinkedHashSet<>(
            bookingRepository.findByEventIdOrderByCreatedAtAsc(eventId).stream()
                .filter(booking -> !"CANCELLED".equalsIgnoreCase(booking.getBookingStatus()))
                .flatMap(booking -> splitSeatLabels(booking.getSeatLabels()).stream())
                .toList()
        );
    }

    private List<String> cleanSeatLabels(List<String> seatLabels) {
        if (seatLabels == null || seatLabels.isEmpty()) {
            return List.of();
        }

        Set<String> uniqueSeats = new LinkedHashSet<>();

        for (String seatLabel : seatLabels) {
            if (seatLabel != null && !seatLabel.isBlank()) {
                uniqueSeats.add(seatLabel.trim().toUpperCase());
            }
        }

        return new ArrayList<>(uniqueSeats);
    }

    private List<String> splitSeatLabels(String seatLabels) {
        if (seatLabels == null || seatLabels.isBlank()) {
            return List.of();
        }

        return Arrays.stream(seatLabels.split(","))
            .map(String::trim)
            .filter(value -> !value.isBlank())
            .toList();
    }

    private BigDecimal parsePrice(String price) {
        if (isFreeEvent(price)) {
            return BigDecimal.ZERO;
        }

        String cleanedPrice = price.replaceAll("[^0-9.,]", "").replace(",", "").trim();

        try {
            return new BigDecimal(cleanedPrice);
        } catch (NumberFormatException exception) {
            return BigDecimal.ZERO;
        }
    }

    private boolean isFreeEvent(String price) {
        return price == null || price.isBlank() || "Free".equalsIgnoreCase(price.trim());
    }

    private String buildDescription(ValidatedPayPalBooking validatedBooking) {
        return validatedBooking.event().getTitle() + " - " + validatedBooking.selectedSeats().size() + " seats";
    }

    private String buildCustomId(ValidatedPayPalBooking validatedBooking) {
        return "event-" + validatedBooking.event().getId() + "-user-" + validatedBooking.user().getId();
    }

    private String extractPayPalMessage(JsonNode jsonNode, String fallback) {
        JsonNode detailsNode = jsonNode.path("details");

        if (detailsNode.isArray() && !detailsNode.isEmpty()) {
            String message = detailsNode.get(0).path("description").asText();

            if (!message.isBlank()) {
                return message;
            }
        }

        String message = jsonNode.path("message").asText();

        if (!message.isBlank()) {
            return message;
        }

        String errorDescription = jsonNode.path("error_description").asText();

        if (!errorDescription.isBlank()) {
            return errorDescription;
        }

        String errorName = jsonNode.path("error").asText();
        return errorName.isBlank() ? fallback : errorName;
    }

    private JsonNode parseJson(String body) {
        try {
            return objectMapper.readTree(body == null ? "{}" : body);
        } catch (Exception exception) {
            return objectMapper.createObjectNode();
        }
    }

    private void ensureConfigured() {
        if (!isConfigured()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PayPal Sandbox is not configured yet");
        }
    }

    private boolean isConfigured() {
        return !payPalClientId.isBlank() && !payPalClientSecret.isBlank();
    }

    private String getErrorSummary(Exception exception) {
        Throwable current = exception;

        while (current != null) {
            String message = current.getMessage();

            if (message != null && !message.isBlank()) {
                return message;
            }

            current = current.getCause();
        }

        return exception.getClass().getSimpleName();
    }

    private record ValidatedPayPalBooking(
        User user,
        Event event,
        List<String> selectedSeats,
        BigDecimal totalAmount
    ) {
    }
}
