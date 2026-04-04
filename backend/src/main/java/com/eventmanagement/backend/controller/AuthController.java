package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.dto.ApiMessageResponse;
import com.eventmanagement.backend.dto.AuthResponse;
import com.eventmanagement.backend.dto.ForgotPasswordRequest;
import com.eventmanagement.backend.dto.ForgotPasswordResponse;
import com.eventmanagement.backend.dto.LoginRequest;
import com.eventmanagement.backend.dto.RegisterRequest;
import com.eventmanagement.backend.dto.ResetPasswordRequest;
import com.eventmanagement.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/forgot-password")
    public ForgotPasswordResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public ApiMessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }

    @GetMapping("/profile")
    public AuthResponse profile(HttpServletRequest request) {
        return authService.profile(request);
    }
}
