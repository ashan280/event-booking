package com.eventmanagement.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class EventControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void eventListWorks() throws Exception {
        mockMvc.perform(get("/api/events"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].title").value("Intro to Web Development Workshop"))
            .andExpect(jsonPath("$[0].category").value("Technology"));
    }

    @Test
    void eventSearchWorks() throws Exception {
        mockMvc.perform(get("/api/events").param("category", "Networking"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].title").value("Young Professionals Meetup"));
    }

    @Test
    void cityFilterWorks() throws Exception {
        mockMvc.perform(get("/api/events").param("city", "Dublin"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].city").value("Dublin"));
    }

    @Test
    void searchAndCityFilterWork() throws Exception {
        mockMvc.perform(get("/api/events")
                .param("search", "Young")
                .param("city", "Dublin"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].title").value("Young Professionals Meetup"));
    }

    @Test
    void eventDetailsWork() throws Exception {
        mockMvc.perform(get("/api/events/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Intro to Web Development Workshop"))
            .andExpect(jsonPath("$.venue").value("The Digital Hub"));
    }

    @Test
    void categoriesWork() throws Exception {
        mockMvc.perform(get("/api/events/categories"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").exists())
            .andExpect(jsonPath("$[0].eventCount").exists());
    }

    @Test
    void citiesWork() throws Exception {
        mockMvc.perform(get("/api/events/cities"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").exists())
            .andExpect(jsonPath("$[0].eventCount").exists());
    }

    @Test
    void venuesWork() throws Exception {
        mockMvc.perform(get("/api/events/venues"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").exists())
            .andExpect(jsonPath("$[0].city").exists());
    }

    @Test
    void venueDetailsWork() throws Exception {
        mockMvc.perform(get("/api/events/venues/{city}/{name}", "Dublin", "The Digital Hub"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("The Digital Hub"))
            .andExpect(jsonPath("$.city").value("Dublin"))
            .andExpect(jsonPath("$.events[0].title").value("Intro to Web Development Workshop"));
    }

    @Test
    void addEventWorks() throws Exception {
        String adminToken = loginAsAdmin();

        mockMvc.perform(post("/api/events")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "title": "Student Coding Workshop",
                      "category": "Workshops",
                      "venue": "Tech Lab",
                      "city": "Dublin",
                      "date": "2026-05-15",
                      "time": "2:00 PM",
                      "price": "EUR 25",
                      "shortDescription": "A simple workshop for coding basics.",
                      "description": "Students can join and learn coding basics with practice sessions and group work.",
                      "availableSeats": 40
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Student Coding Workshop"))
            .andExpect(jsonPath("$.venue").value("Tech Lab"))
            .andExpect(jsonPath("$.availableSeats").value(40));
    }

    @Test
    void updateEventWorks() throws Exception {
        String adminToken = loginAsAdmin();

        mockMvc.perform(put("/api/events/1")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "title": "Intro to Web Development Workshop Updated",
                      "category": "Technology",
                      "venue": "The Digital Hub",
                      "city": "Dublin",
                      "date": "2026-05-11",
                      "time": "1:00 PM - 4:00 PM",
                      "price": "Free",
                      "shortDescription": "Updated workshop details.",
                      "description": "Updated workshop details with a new schedule for students.",
                      "availableSeats": 100
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Intro to Web Development Workshop Updated"))
            .andExpect(jsonPath("$.time").value("1:00 PM - 4:00 PM"))
            .andExpect(jsonPath("$.availableSeats").value(100));
    }

    @Test
    void deleteEventWorks() throws Exception {
        String adminToken = loginAsAdmin();

        mockMvc.perform(delete("/api/events/1")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk());

        mockMvc.perform(get("/api/events/1"))
            .andExpect(status().isNotFound());
    }

    @Test
    void addEventNeedsAdmin() throws Exception {
        String userToken = registerAsUser();

        mockMvc.perform(post("/api/events")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "title": "User Event",
                      "category": "Music",
                      "venue": "Hall A",
                      "city": "Dublin",
                      "date": "2026-06-01",
                      "time": "6:00 PM",
                      "price": "Free",
                      "shortDescription": "User should not create this.",
                      "description": "This request should fail because the user is not an admin.",
                      "availableSeats": 20
                    }
                    """))
            .andExpect(status().isForbidden());
    }

    private String loginAsAdmin() throws Exception {
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

    private String registerAsUser() throws Exception {
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
}
