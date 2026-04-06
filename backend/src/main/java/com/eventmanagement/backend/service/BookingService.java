package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.BookingDto;
import com.eventmanagement.backend.model.Booking;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.BookingRepository;
import com.eventmanagement.backend.repository.EventRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final AuthService authService;

    public BookingDto.BookingResponse createBooking(HttpServletRequest request, BookingDto.BookingRequest bookingRequest) {
        User user = authService.getCurrentUser(request);
        Event event = eventRepository.findById(bookingRequest.getEventId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

        if (event.getAvailableSeats() < bookingRequest.getSeatCount()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough seats available");
        }

        event.setAvailableSeats(event.getAvailableSeats() - bookingRequest.getSeatCount());
        eventRepository.save(event);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setSeatCount(bookingRequest.getSeatCount());
        booking.setTotalAmount(parsePrice(event.getPrice()).multiply(BigDecimal.valueOf(bookingRequest.getSeatCount())));
        booking.setBookingStatus("CONFIRMED");
        booking.setPaymentMethod(getPaymentMethod(bookingRequest.getPaymentMethod(), event.getPrice()));
        booking.setPaymentStatus(isFreeEvent(event.getPrice()) ? "FREE" : "PAID");
        booking.setTicketCode(buildTicketCode());

        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingDto.BookingResponse> getUserBookings(HttpServletRequest request) {
        User user = authService.getCurrentUser(request);
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
            .map(this::toResponse)
            .toList();
    }

    public BookingDto.BookingResponse getBookingById(HttpServletRequest request, Long bookingId) {
        User user = authService.getCurrentUser(request);
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        boolean isOwner = booking.getUser().getId().equals(user.getId());
        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());

        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot open this booking");
        }

        return toResponse(booking);
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

        String cleanedPrice = price.replace("LKR", "").replace(",", "").trim();

        try {
            return new BigDecimal(cleanedPrice);
        } catch (NumberFormatException exception) {
            return BigDecimal.ZERO;
        }
    }

    private boolean isFreeEvent(String price) {
        return price == null || price.isBlank() || "Free".equalsIgnoreCase(price.trim());
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
            booking.getSeatCount(),
            booking.getTotalAmount(),
            booking.getBookingStatus(),
            booking.getPaymentMethod(),
            booking.getPaymentStatus(),
            booking.getTicketCode(),
            booking.getCreatedAt()
        );
    }
}
