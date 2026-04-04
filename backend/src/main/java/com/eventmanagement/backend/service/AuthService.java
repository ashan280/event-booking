package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.AuthDto;
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

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        User user = userRepository.findByEmail(normalizeEmail(request.getEmail()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or password is wrong"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or password is wrong");
        }

        return buildAuthResponse(user, "Login successful");
    }

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
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

    public AuthDto.ForgotPasswordResponse forgotPassword(AuthDto.ForgotPasswordRequest request) {
        String email = normalizeEmail(request.getEmail());
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found for this email"));

        String resetToken = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(15);

        user.setResetToken(resetToken);
        user.setResetTokenExpiresAt(expiresAt);
        userRepository.save(user);

        return new AuthDto.ForgotPasswordResponse("Password reset link created", resetToken);
    }

    public AuthDto.MessageResponse resetPassword(AuthDto.ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken().trim())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset token is not valid"));

        if (user.getResetTokenExpiresAt() == null || user.getResetTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset token has expired");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiresAt(null);
        userRepository.save(user);

        return new AuthDto.MessageResponse("Password updated successfully");
    }

    public AuthDto.AuthResponse profile(HttpServletRequest request) {
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

    private AuthDto.AuthResponse buildAuthResponse(User user, String message) {
        String token = UUID.randomUUID().toString();
        activeSessions.put(token, user.getId());
        return new AuthDto.AuthResponse(
            message,
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getRole(),
            user.getCreatedAt(),
            token
        );
    }

    private AuthDto.AuthResponse userDetails(User user, String message) {
        return new AuthDto.AuthResponse(
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
