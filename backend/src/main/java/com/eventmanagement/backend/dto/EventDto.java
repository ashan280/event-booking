package com.eventmanagement.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

public final class EventDto {

    private EventDto() {
    }

    @Getter
    @AllArgsConstructor
    public static class EventResponse {

        private final Long id;
        private final String title;
        private final String category;
        private final String venue;
        private final String city;
        private final String date;
        private final String time;
        private final String price;
        private final String shortDescription;
        private final String description;
        private final Integer availableSeats;
    }
}
