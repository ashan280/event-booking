package com.eventmanagement.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
}
