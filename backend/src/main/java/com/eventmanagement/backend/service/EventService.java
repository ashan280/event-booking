package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.EventDto;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.repository.EventRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<EventDto.EventResponse> getEvents(String search, String category, String city, String sort, boolean freeOnly) {
        String searchValue = normalize(search);
        String categoryValue = normalize(category);
        String cityValue = normalize(city);

        return sortEvents(eventRepository.findAll().stream()
            .filter(event -> matchesSearch(event, searchValue))
            .filter(event -> matchesCategory(event, categoryValue))
            .filter(event -> matchesCity(event, cityValue))
            .filter(event -> !freeOnly || "Free".equalsIgnoreCase(event.getPrice()))
            .map(this::toResponse)
            .toList(), normalize(sort));
    }

    public EventDto.EventResponse getEventById(Long id) {
        return toResponse(findEvent(id));
    }

    public List<EventDto.CategoryResponse> getCategories() {
        return eventRepository.findAll().stream()
            .collect(java.util.stream.Collectors.groupingBy(Event::getCategory, java.util.stream.Collectors.counting()))
            .entrySet()
            .stream()
            .sorted(Map.Entry.comparingByKey())
            .map(entry -> new EventDto.CategoryResponse(entry.getKey(), entry.getValue()))
            .toList();
    }

    public List<EventDto.CityResponse> getCities() {
        return eventRepository.findAll().stream()
            .collect(java.util.stream.Collectors.groupingBy(Event::getCity, java.util.stream.Collectors.counting()))
            .entrySet()
            .stream()
            .sorted(Map.Entry.comparingByKey())
            .map(entry -> new EventDto.CityResponse(entry.getKey(), entry.getValue()))
            .toList();
    }

    public List<EventDto.VenueResponse> getVenues() {
        return eventRepository.findAll().stream()
            .collect(
                java.util.stream.Collectors.groupingBy(
                    event -> event.getVenue() + "||" + event.getCity(),
                    java.util.stream.Collectors.counting()
                )
            )
            .entrySet()
            .stream()
            .map(entry -> {
                String[] parts = entry.getKey().split("\\|\\|");
                return new EventDto.VenueResponse(parts[0], parts[1], entry.getValue());
            })
            .sorted(Comparator.comparing(EventDto.VenueResponse::getCity).thenComparing(EventDto.VenueResponse::getName))
            .toList();
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

    private List<EventDto.EventResponse> sortEvents(List<EventDto.EventResponse> events, String sort) {
        Comparator<EventDto.EventResponse> comparator = Comparator.comparing(EventDto.EventResponse::getDate);

        if ("title".equals(sort)) {
            comparator = Comparator.comparing(EventDto.EventResponse::getTitle, String.CASE_INSENSITIVE_ORDER);
        } else if ("city".equals(sort)) {
            comparator = Comparator.comparing(EventDto.EventResponse::getCity, String.CASE_INSENSITIVE_ORDER)
                .thenComparing(EventDto.EventResponse::getTitle, String.CASE_INSENSITIVE_ORDER);
        } else if ("latest".equals(sort)) {
            comparator = Comparator.comparing(EventDto.EventResponse::getDate).reversed();
        }

        return events.stream()
            .sorted(comparator)
            .toList();
    }
}
