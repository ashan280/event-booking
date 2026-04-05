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

        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingDto.BookingResponse> getUserBookings(HttpServletRequest request) {
        User user = authService.getCurrentUser(request);
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
            .map(this::toResponse)
            .toList();
    }

    public List<BookingDto.BookingResponse> getRecentBookings() {
        return bookingRepository.findTop5ByOrderByCreatedAtDesc().stream()
            .map(this::toResponse)
            .toList();
    }

    private BigDecimal parsePrice(String price) {
        if (price == null || price.isBlank() || "Free".equalsIgnoreCase(price.trim())) {
            return BigDecimal.ZERO;
        }

        String cleanedPrice = price.replace("LKR", "").replace(",", "").trim();

        try {
            return new BigDecimal(cleanedPrice);
        } catch (NumberFormatException exception) {
            return BigDecimal.ZERO;
        }
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
            booking.getCreatedAt()
        );
    }
}
