package com.eventmanagement.backend.dto;

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
}
