package com.eventmanagement.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Getter
    @AllArgsConstructor
    public static class CategoryResponse {

        private final String name;
        private final Long eventCount;
    }

    @Getter
    @AllArgsConstructor
    public static class VenueResponse {

        private final String name;
        private final String city;
        private final Long eventCount;
    }

    @Getter
    @AllArgsConstructor
    public static class VenueDetailsResponse {

        private final String name;
        private final String city;
        private final Long eventCount;
        private final List<EventResponse> events;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class EventRequest {

        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Category is required")
        private String category;

        @NotBlank(message = "Venue is required")
        private String venue;

        @NotBlank(message = "City is required")
        private String city;

        @NotBlank(message = "Date is required")
        private String date;

        @NotBlank(message = "Time is required")
        private String time;

        @NotBlank(message = "Price is required")
        private String price;

        @NotBlank(message = "Short description is required")
        @Size(max = 120, message = "Short description is too long")
        private String shortDescription;

        @NotBlank(message = "Description is required")
        @Size(max = 500, message = "Description is too long")
        private String description;

        @Min(value = 1, message = "Available seats must be at least 1")
        private Integer availableSeats;
    }
}
