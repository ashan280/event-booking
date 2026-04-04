package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.dto.LoginRequest;
import com.eventmanagement.backend.dto.RegisterRequest;
import com.eventmanagement.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Map;
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
    public Map<String, Object> login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    public Map<String, Object> register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @GetMapping("/profile")
    public Map<String, Object> profile(HttpServletRequest request) {
        return authService.profile(request);
    }
}
