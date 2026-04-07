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
class ReviewControllerTests {

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
    void loggedInUserCanAddAndReadReview() throws Exception {
        MvcResult registerResult = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "fullName": "Ashan Maduwantha",
                      "email": "ashan@example.com",
                      "password": "secret123"
                    }
                    """))
            .andExpect(status().isOk())
            .andReturn();

        JsonNode registerBody = objectMapper.readTree(registerResult.getResponse().getContentAsString());
        String token = registerBody.get("token").asText();

        mockMvc.perform(post("/api/reviews")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "rating": 5,
                      "comment": "Very good event booking system"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Review saved"))
            .andExpect(jsonPath("$.fullName").value("Ashan Maduwantha"))
            .andExpect(jsonPath("$.rating").value(5));

        mockMvc.perform(get("/api/reviews"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].fullName").value("Ashan Maduwantha"))
            .andExpect(jsonPath("$[0].rating").value(5))
            .andExpect(jsonPath("$[0].comment").value("Very good event booking system"));
    }

    @Test
    void guestCannotAddReview() throws Exception {
        mockMvc.perform(post("/api/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "rating": 4,
                      "comment": "Good"
                    }
                    """))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.message").value("Please log in first"));
    }
}
