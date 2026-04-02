package com.eventmanagement.backend.controller;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "service", "event-booking-backend");
    }

    @GetMapping("/featured-events")
    public List<Map<String, String>> featuredEvents() {
        return List.of(
            Map.of(
                "title", "Colombo Music Night",
                "date", "2026-04-12",
                "location", "Colombo",
                "price", "LKR 2,500"
            ),
            Map.of(
                "title", "Startup Meetup 2026",
                "date", "2026-04-20",
                "location", "Kandy",
                "price", "Free"
            ),
            Map.of(
                "title", "Food Festival Weekend",
                "date", "2026-04-28",
                "location", "Galle",
                "price", "LKR 1,200"
            )
        );
    }
}
