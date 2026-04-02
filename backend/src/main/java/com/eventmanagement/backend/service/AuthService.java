package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.LoginRequest;
import com.eventmanagement.backend.dto.RegisterRequest;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public Map<String, String> login(LoginRequest request) {
        return Map.of(
            "message", "Login structure is ready",
            "email", valueOrDefault(request.getEmail())
        );
    }

    public Map<String, String> register(RegisterRequest request) {
        return Map.of(
            "message", "Register structure is ready",
            "fullName", valueOrDefault(request.getFullName()),
            "email", valueOrDefault(request.getEmail())
        );
    }

    public Map<String, String> profile() {
        return Map.of(
            "fullName", "Sample User",
            "email", "sampleuser@email.com",
            "role", "USER"
        );
    }

    private String valueOrDefault(String value) {
        return value == null || value.isBlank() ? "not-provided" : value;
    }
}
