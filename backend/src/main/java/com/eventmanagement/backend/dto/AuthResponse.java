package com.eventmanagement.backend.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private final String message;
    private final Long id;
    private final String fullName;
    private final String email;
    private final String role;
    private final LocalDateTime createdAt;
    private final String token;
}
