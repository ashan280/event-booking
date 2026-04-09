package com.eventmanagement.backend.service;

import com.eventmanagement.backend.model.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class JwtService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String secret;
    private final long expirationMinutes;

    public JwtService(
        @Value("${app.jwt.secret}") String secret,
        @Value("${app.jwt.expiration-minutes:180}") long expirationMinutes
    ) {
        this.secret = secret;
        this.expirationMinutes = expirationMinutes;
    }

    public String createToken(User user) {
        Map<String, Object> header = Map.of(
            "alg", "HS256",
            "typ", "JWT"
        );

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", String.valueOf(user.getId()));
        payload.put("email", user.getEmail());
        payload.put("role", user.getRole());
        payload.put("exp", Instant.now().plusSeconds(expirationMinutes * 60).getEpochSecond());

        try {
            String encodedHeader = encode(objectMapper.writeValueAsBytes(header));
            String encodedPayload = encode(objectMapper.writeValueAsBytes(payload));
            String signature = sign(encodedHeader + "." + encodedPayload);
            return encodedHeader + "." + encodedPayload + "." + signature;
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Token creation failed");
        }
    }

    public JwtUser parseToken(String token) {
        try {
            String[] parts = token.split("\\.");

            if (parts.length != 3) {
                throw invalidToken();
            }

            String content = parts[0] + "." + parts[1];

            if (!sign(content).equals(parts[2])) {
                throw invalidToken();
            }

            Map<String, Object> payload = objectMapper.readValue(
                decode(parts[1]),
                new TypeReference<>() {
                }
            );

            long expiresAt = Long.parseLong(String.valueOf(payload.get("exp")));

            if (Instant.now().getEpochSecond() >= expiresAt) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token expired");
            }

            Long userId = Long.parseLong(String.valueOf(payload.get("sub")));
            String email = String.valueOf(payload.get("email"));
            String role = String.valueOf(payload.get("role"));

            return new JwtUser(userId, email, role);
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw invalidToken();
        }
    }

    private String sign(String content) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return encode(mac.doFinal(content.getBytes(StandardCharsets.UTF_8)));
    }

    private String encode(byte[] value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value);
    }

    private byte[] decode(String value) {
        return Base64.getUrlDecoder().decode(value);
    }

    private ResponseStatusException invalidToken() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
    }

    public record JwtUser(Long userId, String email, String role) {
    }
}
