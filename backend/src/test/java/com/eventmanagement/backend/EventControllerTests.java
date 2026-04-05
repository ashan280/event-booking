package com.eventmanagement.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
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

    @Test
    void updateEventWorks() throws Exception {
        mockMvc.perform(put("/api/events/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "title": "Colombo Music Night Updated",
                      "category": "Music",
                      "venue": "Lotus Hall",
                      "city": "Colombo",
                      "date": "2026-04-14",
                      "time": "8:00 PM",
                      "price": "LKR 2,800",
                      "shortDescription": "Updated music event details.",
                      "description": "Updated event details for the music night with a new time and date.",
                      "availableSeats": 100
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Colombo Music Night Updated"))
            .andExpect(jsonPath("$.time").value("8:00 PM"))
            .andExpect(jsonPath("$.availableSeats").value(100));
    }

    @Test
    void deleteEventWorks() throws Exception {
        mockMvc.perform(delete("/api/events/1"))
            .andExpect(status().isOk());

        mockMvc.perform(get("/api/events/1"))
            .andExpect(status().isNotFound());
    }
}
