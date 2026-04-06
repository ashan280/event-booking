package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.dto.BookingDto;
import com.eventmanagement.backend.service.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public BookingDto.BookingResponse createBooking(
        @Valid @RequestBody BookingDto.BookingRequest bookingRequest,
        HttpServletRequest request
    ) {
        return bookingService.createBooking(request, bookingRequest);
    }

    @GetMapping
    public List<BookingDto.BookingResponse> getUserBookings(HttpServletRequest request) {
        return bookingService.getUserBookings(request);
    }

    @GetMapping("/{bookingId}")
    public BookingDto.BookingResponse getBookingById(@PathVariable Long bookingId, HttpServletRequest request) {
        return bookingService.getBookingById(request, bookingId);
    }
}
