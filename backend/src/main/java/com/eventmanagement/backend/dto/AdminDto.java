package com.eventmanagement.backend.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

public final class AdminDto {

    private AdminDto() {
    }

    @Getter
    @AllArgsConstructor
    public static class DashboardResponse {

        private final long totalUsers;
        private final long totalEvents;
        private final long totalBookings;
        private final long totalVenues;
        private final List<BookingDto.BookingResponse> recentBookings;
    }

    @Getter
    @AllArgsConstructor
    public static class BookingReportResponse {

        private final long totalBookings;
        private final long confirmedBookings;
        private final long cancelledBookings;
        private final long totalSeatsBooked;
        private final BigDecimal totalRevenue;
        private final List<CitySummary> citySummaries;
        private final List<BookingDto.BookingResponse> recentBookings;
    }

    @Getter
    @AllArgsConstructor
    public static class CitySummary {

        private final String city;
        private final long bookingCount;
        private final long seatsBooked;
        private final BigDecimal revenue;
    }
}
