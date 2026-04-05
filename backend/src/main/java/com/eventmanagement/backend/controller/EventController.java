package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.dto.EventDto;
import com.eventmanagement.backend.service.EventService;
import java.util.List;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @PostMapping
    public EventDto.EventResponse addEvent(@Valid @RequestBody EventDto.EventRequest request) {
        return eventService.addEvent(request);
    }

    @PutMapping("/{id}")
    public EventDto.EventResponse updateEvent(@PathVariable Long id, @Valid @RequestBody EventDto.EventRequest request) {
        return eventService.updateEvent(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }

    @GetMapping("/categories")
    public List<EventDto.CategoryResponse> getCategories() {
        return eventService.getCategories();
    }

    @GetMapping("/venues")
    public List<EventDto.VenueResponse> getVenues() {
        return eventService.getVenues();
    }

    @GetMapping("/venues/{city}/{name}")
    public EventDto.VenueDetailsResponse getVenueDetails(@PathVariable String city, @PathVariable String name) {
        return eventService.getVenueDetails(city, name);
    }
}
