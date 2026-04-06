package com.eventmanagement.backend;

import com.eventmanagement.backend.model.User;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class BookingControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void clearData() {
        bookingRepository.deleteAll();
        reviewRepository.deleteAll();
        userRepository.deleteAll();
        createAdminUser();
    }

    @Test
    void loggedInUserCanBookAndSeeHistory() throws Exception {
        String token = registerUserAndGetToken();

        mockMvc.perform(get("/api/bookings/events/1/seats"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.bookedSeats").isArray());

        MvcResult bookingResult = mockMvc.perform(post("/api/bookings")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "eventId": 1,
                      "seatCount": 2,
                      "paymentMethod": "Card",
                      "seatLabels": ["A1", "A2"]
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.eventTitle").value("Colombo Music Night"))
            .andExpect(jsonPath("$.seatCount").value(2))
            .andExpect(jsonPath("$.bookingStatus").value("CONFIRMED"))
            .andExpect(jsonPath("$.paymentMethod").value("Card"))
            .andExpect(jsonPath("$.paymentStatus").value("PAID"))
            .andExpect(jsonPath("$.seatLabels[0]").value("A1"))
            .andExpect(jsonPath("$.seatLabels[1]").value("A2"))
            .andReturn();

        JsonNode bookingResponse = objectMapper.readTree(bookingResult.getResponse().getContentAsString());
        long bookingId = bookingResponse.get("id").asLong();
        String ticketCode = bookingResponse.get("ticketCode").asText();

        mockMvc.perform(get("/api/bookings")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].eventTitle").value("Colombo Music Night"))
            .andExpect(jsonPath("$[0].seatCount").value(2))
            .andExpect(jsonPath("$[0].seatLabels[0]").value("A1"))
            .andExpect(jsonPath("$[0].ticketCode").value(ticketCode));

        mockMvc.perform(get("/api/bookings/" + bookingId)
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(bookingId))
            .andExpect(jsonPath("$.ticketCode").value(ticketCode));

        mockMvc.perform(get("/api/bookings/events/1/seats"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.bookedSeats[0]").value("A1"))
            .andExpect(jsonPath("$.bookedSeats[1]").value("A2"));

        mockMvc.perform(post("/api/bookings/" + bookingId + "/cancel")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.bookingStatus").value("CANCELLED"))
            .andExpect(jsonPath("$.paymentStatus").value("REFUNDED"));

        mockMvc.perform(get("/api/bookings/events/1/seats"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.bookedSeats").isEmpty());
    }

    @Test
    void guestCannotBookEvent() throws Exception {
        mockMvc.perform(post("/api/bookings")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "eventId": 1,
                      "seatCount": 1,
                      "paymentMethod": "Card",
                      "seatLabels": ["A1"]
                    }
                    """))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.message").value("Please login first"));
    }

    @Test
    void adminDashboardWorksForAdmin() throws Exception {
        String userToken = registerUserAndGetToken();

        mockMvc.perform(post("/api/bookings")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "eventId": 1,
                      "seatCount": 1,
                      "paymentMethod": "Card",
                      "seatLabels": ["A1"]
                    }
                    """))
            .andExpect(status().isOk());

        String adminToken = loginAdminAndGetToken();

        mockMvc.perform(get("/api/admin/dashboard")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.totalUsers").exists())
            .andExpect(jsonPath("$.totalEvents").exists())
            .andExpect(jsonPath("$.recentBookings[0].eventTitle").value("Colombo Music Night"));

        mockMvc.perform(get("/api/admin/bookings/report")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.totalBookings").exists())
            .andExpect(jsonPath("$.confirmedBookings").exists())
            .andExpect(jsonPath("$.totalSeatsBooked").exists())
            .andExpect(jsonPath("$.totalRevenue").exists());
    }

    private String registerUserAndGetToken() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "fullName": "Test User",
                      "email": "user@example.com",
                      "password": "password123"
                    }
                    """))
            .andExpect(status().isOk())
            .andReturn();

        JsonNode response = objectMapper.readTree(result.getResponse().getContentAsString());
        return response.get("token").asText();
    }

    private String loginAdminAndGetToken() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "email": "admin@eventhub.com",
                      "password": "admin123"
                    }
                    """))
            .andExpect(status().isOk())
            .andReturn();

        JsonNode response = objectMapper.readTree(result.getResponse().getContentAsString());
        return response.get("token").asText();
    }

    private void createAdminUser() {
        User admin = new User();
        admin.setFullName("Event Admin");
        admin.setEmail("admin@eventhub.com");
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        userRepository.save(admin);
    }
}
