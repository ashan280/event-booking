package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.EventDto;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.repository.EventRepository;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<EventDto.EventResponse> getEvents(String search, String category, String city) {
        String searchValue = normalize(search);
        String categoryValue = normalize(category);
        String cityValue = normalize(city);
        List<EventDto.EventResponse> results = new ArrayList<>();

        for (Event event : eventRepository.findAll()) {
            if (!matchesSearch(event, searchValue)) {
                continue;
            }

            if (!matchesCategory(event, categoryValue)) {
                continue;
            }

            if (!matchesCity(event, cityValue)) {
                continue;
            }

            results.add(toResponse(event));
        }

        return results;
    }

    public EventDto.EventResponse getEventById(Long id) {
        return toResponse(findEvent(id));
    }

    public List<EventDto.CategoryResponse> getCategories() {
        LinkedHashMap<String, Long> categoryCounts = new LinkedHashMap<>();

        for (Event event : eventRepository.findAll()) {
            categoryCounts.put(event.getCategory(), categoryCounts.getOrDefault(event.getCategory(), 0L) + 1);
        }

        List<EventDto.CategoryResponse> results = new ArrayList<>();

        for (String name : categoryCounts.keySet()) {
            results.add(new EventDto.CategoryResponse(name, categoryCounts.get(name)));
        }

        return results;
    }

    public List<EventDto.CityResponse> getCities() {
        LinkedHashMap<String, Long> cityCounts = new LinkedHashMap<>();

        for (Event event : eventRepository.findAll()) {
            cityCounts.put(event.getCity(), cityCounts.getOrDefault(event.getCity(), 0L) + 1);
        }

        List<EventDto.CityResponse> results = new ArrayList<>();

        for (String name : cityCounts.keySet()) {
            results.add(new EventDto.CityResponse(name, cityCounts.get(name)));
        }

        return results;
    }

    public List<EventDto.VenueResponse> getVenues() {
        LinkedHashMap<String, Long> venueCounts = new LinkedHashMap<>();

        for (Event event : eventRepository.findAll()) {
            String key = event.getVenue() + "||" + event.getCity();
            venueCounts.put(key, venueCounts.getOrDefault(key, 0L) + 1);
        }

        List<EventDto.VenueResponse> results = new ArrayList<>();

        for (String key : venueCounts.keySet()) {
            String[] parts = key.split("\\|\\|");
            results.add(new EventDto.VenueResponse(parts[0], parts[1], venueCounts.get(key)));
        }

        return results;
    }

    public EventDto.VenueDetailsResponse getVenueDetails(String city, String name) {
        List<EventDto.EventResponse> venueEvents = eventRepository.findAll().stream()
            .filter(event -> event.getCity().equalsIgnoreCase(city))
            .filter(event -> event.getVenue().equalsIgnoreCase(name))
            .map(this::toResponse)
            .toList();

        if (venueEvents.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Venue not found");
        }

        EventDto.EventResponse firstEvent = venueEvents.get(0);

        return new EventDto.VenueDetailsResponse(
            firstEvent.getVenue(),
            firstEvent.getCity(),
            (long) venueEvents.size(),
            venueEvents
        );
    }

    public EventDto.EventResponse addEvent(EventDto.EventRequest request) {
        Event event = new Event();
        applyRequest(event, request);
        return toResponse(eventRepository.save(event));
    }

    public EventDto.EventResponse updateEvent(Long id, EventDto.EventRequest request) {
        Event event = findEvent(id);
        applyRequest(event, request);
        return toResponse(eventRepository.save(event));
    }

    public void deleteEvent(Long id) {
        eventRepository.delete(findEvent(id));
    }

    private boolean matchesSearch(Event event, String search) {
        if (search.isBlank()) {
            return true;
        }

        return contains(event.getTitle(), search)
            || contains(event.getCategory(), search)
            || contains(event.getCity(), search)
            || contains(event.getVenue(), search)
            || contains(event.getDescription(), search);
    }

    private boolean matchesCategory(Event event, String category) {
        return category.isBlank() || event.getCategory().equalsIgnoreCase(category);
    }

    private boolean matchesCity(Event event, String city) {
        return city.isBlank() || event.getCity().equalsIgnoreCase(city);
    }

    private boolean contains(String value, String search) {
        return value.toLowerCase(Locale.ROOT).contains(search);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    private Event findEvent(Long id) {
        return eventRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
    }

    private void applyRequest(Event event, EventDto.EventRequest request) {
        event.setTitle(request.getTitle().trim());
        event.setCategory(request.getCategory().trim());
        event.setVenue(request.getVenue().trim());
        event.setCity(request.getCity().trim());
        event.setDate(request.getDate().trim());
        event.setTime(request.getTime().trim());
        event.setPrice(request.getPrice().trim());
        event.setShortDescription(request.getShortDescription().trim());
        event.setDescription(request.getDescription().trim());
        event.setAvailableSeats(request.getAvailableSeats());
    }

    private EventDto.EventResponse toResponse(Event event) {
        return new EventDto.EventResponse(
            event.getId(),
            event.getTitle(),
            event.getCategory(),
            event.getVenue(),
            event.getCity(),
            event.getDate(),
            event.getTime(),
            event.getPrice(),
            event.getShortDescription(),
            event.getDescription(),
            event.getAvailableSeats()
        );
    }
}
