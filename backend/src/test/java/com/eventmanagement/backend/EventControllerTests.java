package com.eventmanagement.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class EventControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void eventListWorks() throws Exception {
        mockMvc.perform(get("/api/events"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].title").value("Colombo Music Night"))
            .andExpect(jsonPath("$[0].category").value("Music"));
    }

    @Test
    void eventSearchWorks() throws Exception {
        mockMvc.perform(get("/api/events").param("category", "Business"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].title").value("Startup Meetup 2026"));
    }

    @Test
    void eventDetailsWork() throws Exception {
        mockMvc.perform(get("/api/events/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Colombo Music Night"))
            .andExpect(jsonPath("$.venue").value("Lotus Hall"));
    }

    @Test
    void categoriesWork() throws Exception {
        mockMvc.perform(get("/api/events/categories"))
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
    void addEventWorks() throws Exception {
        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "title": "Student Coding Workshop",
                      "category": "Workshops",
                      "venue": "Tech Lab",
                      "city": "Colombo",
                      "date": "2026-05-15",
                      "time": "2:00 PM",
                      "price": "LKR 1,500",
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
}
