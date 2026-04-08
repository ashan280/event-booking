package com.eventmanagement.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public final class ReviewDto {

    private ReviewDto() {
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class ReviewRequest {

        @NotNull(message = "Event is required")
        private Long eventId;

        @Min(value = 1, message = "Rating must be at least 1")
        @Max(value = 5, message = "Rating must be at most 5")
        private Integer rating;

        @NotBlank(message = "Comment is required")
        @Size(max = 500, message = "Comment is too long")
        private String comment;
    }

    @Getter
    @AllArgsConstructor
    public static class ReviewResponse {

        private final String message;
        private final Long id;
        private final Long eventId;
        private final String eventTitle;
        private final Long userId;
        private final String fullName;
        private final Integer rating;
        private final String comment;
        private final LocalDateTime createdAt;
    }
}
