package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.BookingDto;
import com.eventmanagement.backend.model.Booking;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.BookingRepository;
import com.eventmanagement.backend.repository.EventRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final AuthService authService;

    @Transactional
    public BookingDto.BookingResponse createBooking(HttpServletRequest request, BookingDto.BookingRequest bookingRequest) {
        User user = authService.getCurrentUser(request);
        return createBookingForUser(user, bookingRequest, null);
    }

    @Transactional
    public BookingDto.BookingResponse createBookingForUser(
        User user,
        BookingDto.BookingRequest bookingRequest,
        String paymentMethodOverride
    ) {
        Event event = eventRepository.findById(bookingRequest.getEventId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        List<String> selectedSeats = cleanSeatLabels(bookingRequest.getSeatLabels());

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

        event.setAvailableSeats(event.getAvailableSeats() - bookingRequest.getSeatCount());
        eventRepository.save(event);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setSeatCount(bookingRequest.getSeatCount());
        booking.setSeatLabels(String.join(",", selectedSeats));
        booking.setTotalAmount(parsePrice(event.getPrice()).multiply(BigDecimal.valueOf(bookingRequest.getSeatCount())));
        booking.setBookingStatus("CONFIRMED");
        booking.setPaymentMethod(getPaymentMethod(
            paymentMethodOverride != null ? paymentMethodOverride : bookingRequest.getPaymentMethod(),
            event.getPrice()
        ));
        booking.setPaymentStatus(getPaymentStatus(booking.getPaymentMethod(), event.getPrice()));
        booking.setTicketCode(buildTicketCode());

        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingDto.BookingResponse> getUserBookings(HttpServletRequest request) {
        User user = authService.getCurrentUser(request);
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
            .map(this::toResponse)
            .toList();
    }

    public BookingDto.SeatAvailabilityResponse getSeatAvailability(Long eventId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        List<Booking> activeBookings = getActiveEventBookings(eventId);
        List<String> bookedSeats = activeBookings.stream()
            .flatMap(booking -> splitSeatLabels(booking.getSeatLabels()).stream())
            .toList();
        long bookedSeatCount = activeBookings.stream()
            .mapToLong(Booking::getSeatCount)
            .sum();

        return new BookingDto.SeatAvailabilityResponse(
            event.getAvailableSeats() + bookedSeatCount,
            event.getAvailableSeats(),
            bookedSeats
        );
    }

    public BookingDto.BookingResponse getBookingById(HttpServletRequest request, Long bookingId) {
        User user = authService.getCurrentUser(request);
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        boolean isOwner = booking.getUser().getId().equals(user.getId());
        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());

        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot view this booking");
        }

        return toResponse(booking);
    }

    @Transactional
    public BookingDto.BookingResponse cancelBooking(HttpServletRequest request, Long bookingId) {
        User user = authService.getCurrentUser(request);
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        boolean isOwner = booking.getUser().getId().equals(user.getId());
        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());

        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot cancel this booking");
        }

        if ("CANCELLED".equalsIgnoreCase(booking.getBookingStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking already cancelled");
        }

        Event event = booking.getEvent();
        event.setAvailableSeats(event.getAvailableSeats() + booking.getSeatCount());
        eventRepository.save(event);

        booking.setBookingStatus("CANCELLED");
        booking.setPaymentStatus(getCancelledPaymentStatus(booking));

        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingDto.BookingResponse> getRecentBookings() {
        return bookingRepository.findTop5ByOrderByCreatedAtDesc().stream()
            .map(this::toResponse)
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

    private List<Booking> getActiveEventBookings(Long eventId) {
        return bookingRepository.findByEventIdOrderByCreatedAtAsc(eventId).stream()
            .filter(booking -> !"CANCELLED".equalsIgnoreCase(booking.getBookingStatus()))
            .toList();
    }

    private Set<String> getBookedSeatSet(Long eventId) {
        return new LinkedHashSet<>(
            getActiveEventBookings(eventId).stream()
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

    private String getPaymentMethod(String paymentMethod, String price) {
        if (isFreeEvent(price)) {
            return "Free";
        }

        if (paymentMethod == null || paymentMethod.isBlank()) {
            return "Card";
        }

        return paymentMethod.trim();
    }

    private String getPaymentStatus(String paymentMethod, String price) {
        if (isFreeEvent(price)) {
            return "FREE";
        }

        if ("Card".equalsIgnoreCase(paymentMethod) || "PayPal".equalsIgnoreCase(paymentMethod)) {
            return "PAID";
        }

        return "PENDING";
    }

    private String getCancelledPaymentStatus(Booking booking) {
        if (booking.getTotalAmount().compareTo(BigDecimal.ZERO) == 0) {
            return "FREE";
        }

        if ("PAID".equalsIgnoreCase(booking.getPaymentStatus())) {
            return "REFUNDED";
        }

        return "CANCELLED";
    }

    private String buildTicketCode() {
        return "TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private BookingDto.BookingResponse toResponse(Booking booking) {
        return new BookingDto.BookingResponse(
            booking.getId(),
            booking.getEvent().getId(),
            booking.getEvent().getTitle(),
            booking.getEvent().getDate(),
            booking.getEvent().getTime(),
            booking.getEvent().getVenue(),
            booking.getEvent().getCity(),
            booking.getEvent().getImageUrl() != null ? booking.getEvent().getImageUrl() : "/images/concert.png",
            booking.getSeatCount(),
            splitSeatLabels(booking.getSeatLabels()),
            booking.getTotalAmount(),
            booking.getBookingStatus(),
            booking.getPaymentMethod(),
            booking.getPaymentStatus(),
            booking.getTicketCode(),
            booking.getCreatedAt()
        );
    }
}
