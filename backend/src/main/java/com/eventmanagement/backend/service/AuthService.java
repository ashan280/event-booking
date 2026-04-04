package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.ApiMessageResponse;
import com.eventmanagement.backend.dto.AuthResponse;
import com.eventmanagement.backend.dto.ForgotPasswordRequest;
import com.eventmanagement.backend.dto.ForgotPasswordResponse;
import com.eventmanagement.backend.dto.LoginRequest;
import com.eventmanagement.backend.dto.RegisterRequest;
import com.eventmanagement.backend.dto.ResetPasswordRequest;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Map<String, Long> activeSessions = new ConcurrentHashMap<>();

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(normalizeEmail(request.getEmail()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or password is wrong"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or password is wrong");
        }

        return buildAuthResponse(user, "Login successful");
    }

    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());

        if (userRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        User savedUser = userRepository.save(user);
        return buildAuthResponse(savedUser, "Register successful");
    }

    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
        String email = normalizeEmail(request.getEmail());
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found for this email"));

        String resetToken = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(15);

        user.setResetToken(resetToken);
        user.setResetTokenExpiresAt(expiresAt);
        userRepository.save(user);

        return new ForgotPasswordResponse("Password reset link created", resetToken);
    }

    public ApiMessageResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken().trim())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset token is not valid"));

        if (user.getResetTokenExpiresAt() == null || user.getResetTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset token has expired");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiresAt(null);
        userRepository.save(user);

        return new ApiMessageResponse("Password updated successfully");
    }

    public AuthResponse profile(HttpServletRequest request) {
        User user = getCurrentUser(request);
        return userDetails(user, "Profile loaded");
    }

    public User getCurrentUser(HttpServletRequest request) {
        String token = getToken(request);
        Long userId = activeSessions.get(token);

        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please login first");
        }

        return userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private AuthResponse buildAuthResponse(User user, String message) {
        String token = UUID.randomUUID().toString();
        activeSessions.put(token, user.getId());
        return new AuthResponse(
            message,
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getRole(),
            user.getCreatedAt(),
            token
        );
    }

    private AuthResponse userDetails(User user, String message) {
        return new AuthResponse(
            message,
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getRole(),
            user.getCreatedAt(),
            null
        );
    }

    private String getToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please login first");
        }

        return header.substring(7);
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
