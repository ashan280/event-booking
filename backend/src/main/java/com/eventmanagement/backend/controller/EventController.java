package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.dto.EventDto;
import com.eventmanagement.backend.service.EventService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public List<EventDto.EventResponse> getEvents(
        @RequestParam(defaultValue = "") String search,
        @RequestParam(defaultValue = "") String category
    ) {
        return eventService.getEvents(search, category);
    }

    @GetMapping("/{id}")
    public EventDto.EventResponse getEvent(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    @GetMapping("/categories")
    public List<EventDto.CategoryResponse> getCategories() {
        return eventService.getCategories();
    }

    @GetMapping("/venues")
    public List<EventDto.VenueResponse> getVenues() {
        return eventService.getVenues();
    }
}
