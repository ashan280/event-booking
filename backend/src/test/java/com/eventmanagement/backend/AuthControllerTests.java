package com.eventmanagement.backend;

import com.eventmanagement.backend.repository.BookingRepository;
import com.eventmanagement.backend.repository.ReviewRepository;
import com.eventmanagement.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @BeforeEach
    void clearData() {
        bookingRepository.deleteAll();
        reviewRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void registerLoginAndProfileFlowWorks() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "fullName": "Ashan Maduwantha",
                      "email": "ashan@example.com",
                      "password": "secret123"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Account created"))
            .andExpect(jsonPath("$.fullName").value("Ashan Maduwantha"))
            .andExpect(jsonPath("$.email").value("ashan@example.com"))
            .andExpect(jsonPath("$.token").exists());

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "email": "ashan@example.com",
                      "password": "secret123"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Login successful"))
            .andReturn();

        JsonNode loginBody = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String token = loginBody.get("token").asText();

        mockMvc.perform(get("/api/auth/profile")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Profile details"))
            .andExpect(jsonPath("$.fullName").value("Ashan Maduwantha"))
            .andExpect(jsonPath("$.email").value("ashan@example.com"))
            .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void loginFailsWithWrongPassword() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "fullName": "Ashan Maduwantha",
                      "email": "ashan@example.com",
                      "password": "secret123"
                    }
                    """))
            .andExpect(status().isOk());

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "email": "ashan@example.com",
                      "password": "wrongpass"
                    }
                    """))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.message").value("Wrong email or password"));
    }

    @Test
    void forgotAndResetPasswordFlowWorks() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "fullName": "Ashan Maduwantha",
                      "email": "ashan@example.com",
                      "password": "secret123"
                    }
                    """))
            .andExpect(status().isOk());

        MvcResult forgotResult = mockMvc.perform(post("/api/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "email": "ashan@example.com"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Reset link created"))
            .andExpect(jsonPath("$.resetToken").exists())
            .andReturn();

        JsonNode forgotBody = objectMapper.readTree(forgotResult.getResponse().getContentAsString());
        String resetToken = forgotBody.get("resetToken").asText();

        mockMvc.perform(post("/api/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "token": "%s",
                      "password": "newpass123"
                    }
                    """.formatted(resetToken)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Password updated"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "email": "ashan@example.com",
                      "password": "newpass123"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Login successful"));
    }

    @Test
    void resetPasswordFailsWithWrongToken() throws Exception {
        mockMvc.perform(post("/api/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "token": "wrong-token",
                      "password": "newpass123"
                    }
                    """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Invalid reset token"));
    }
}
