package com.eventmanagement.backend.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReviewResponse {

    private final String message;
    private final Long id;
    private final String fullName;
    private final Integer rating;
    private final String comment;
    private final LocalDateTime createdAt;
}
