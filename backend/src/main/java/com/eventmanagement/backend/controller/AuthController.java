package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.dto.AuthDto;
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
    public AuthDto.AuthResponse login(@Valid @RequestBody AuthDto.LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    public AuthDto.AuthResponse register(@Valid @RequestBody AuthDto.RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/forgot-password")
    public AuthDto.ForgotPasswordResponse forgotPassword(@Valid @RequestBody AuthDto.ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public AuthDto.MessageResponse resetPassword(@Valid @RequestBody AuthDto.ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }

    @GetMapping("/profile")
    public AuthDto.AuthResponse profile(HttpServletRequest request) {
        return authService.profile(request);
    }
}
