package com.eventmanagement.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public final class AuthDto {

    private AuthDto() {
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class LoginRequest {

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class RegisterRequest {

        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class ForgotPasswordRequest {

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email")
        private String email;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class ResetPasswordRequest {

        @NotBlank(message = "Reset token is required")
        private String token;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;
    }

    @Getter
    @AllArgsConstructor
    public static class MessageResponse {

        private final String message;
    }

    @Getter
    @AllArgsConstructor
    public static class AuthResponse {

        private final String message;
        private final Long id;
        private final String fullName;
        private final String email;
        private final String role;
        private final LocalDateTime createdAt;
        private final String token;
    }

    @Getter
    public static class ForgotPasswordResponse extends MessageResponse {

        private final String resetToken;

        public ForgotPasswordResponse(String message, String resetToken) {
            super(message);
            this.resetToken = resetToken;
        }
    }
}
