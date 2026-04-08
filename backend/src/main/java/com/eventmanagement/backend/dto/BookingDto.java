package com.eventmanagement.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public final class BookingDto {

    private BookingDto() {
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class BookingRequest {

        @NotNull(message = "Event is required")
        private Long eventId;

        @NotNull(message = "Seat count is required")
        @Min(value = 1, message = "Seat count must be at least 1")
        private Integer seatCount;

        private String paymentMethod;

        private List<String> seatLabels;
    }

    @Getter
    @AllArgsConstructor
    public static class SeatAvailabilityResponse {

        private final long totalSeats;
        private final int availableSeats;
        private final List<String> bookedSeats;
    }

    @Getter
    @AllArgsConstructor
    public static class BookingResponse {

        private final Long id;
        private final Long eventId;
        private final String eventTitle;
        private final String eventDate;
        private final String eventTime;
        private final String venue;
        private final String city;
        private final Integer seatCount;
        private final List<String> seatLabels;
        private final BigDecimal totalAmount;
        private final String bookingStatus;
        private final String paymentMethod;
        private final String paymentStatus;
        private final String ticketCode;
        private final LocalDateTime createdAt;
    }
}
