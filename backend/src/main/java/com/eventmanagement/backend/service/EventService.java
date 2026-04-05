package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.EventDto;
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

    private static final List<EventDto.EventResponse> EVENTS = List.of(
        new EventDto.EventResponse(
            1L,
            "Colombo Music Night",
            "Music",
            "Lotus Hall",
            "Colombo",
            "2026-04-12",
            "7:00 PM",
            "LKR 2,500",
            "A live music night with local artists and bands.",
            "Enjoy a full evening with live music, food stalls, and a simple seat booking flow in Colombo.",
            120
        ),
        new EventDto.EventResponse(
            2L,
            "Startup Meetup 2026",
            "Business",
            "City Innovation Hub",
            "Kandy",
            "2026-04-20",
            "10:00 AM",
            "Free",
            "A meetup for students, founders, and small business teams.",
            "Join talks, networking sessions, and startup discussions with local business speakers and student founders.",
            80
        ),
        new EventDto.EventResponse(
            3L,
            "Food Festival Weekend",
            "Food & Drink",
            "Ocean View Grounds",
            "Galle",
            "2026-04-28",
            "4:00 PM",
            "LKR 1,200",
            "Street food, music, and family activities by the coast.",
            "Taste local food, watch live cooking sessions, and enjoy a relaxed weekend event with family and friends.",
            200
        ),
        new EventDto.EventResponse(
            4L,
            "Creative Design Workshop",
            "Workshops",
            "Studio 8",
            "Colombo",
            "2026-05-03",
            "1:00 PM",
            "LKR 3,000",
            "A hands-on design session for beginners and students.",
            "Learn simple design basics, layout ideas, and team project tips in a guided workshop for beginners.",
            35
        ),
        new EventDto.EventResponse(
            5L,
            "City Basketball Challenge",
            "Sports",
            "Metro Sports Arena",
            "Kurunegala",
            "2026-05-09",
            "5:30 PM",
            "LKR 800",
            "A local sports event with team matches and fan seating.",
            "Watch local teams compete, enjoy the match atmosphere, and reserve your seat before the event day.",
            150
        )
    );

    public List<EventDto.EventResponse> getEvents(String search, String category) {
        String searchValue = normalize(search);
        String categoryValue = normalize(category);

        return EVENTS.stream()
            .filter(event -> matchesSearch(event, searchValue))
            .filter(event -> matchesCategory(event, categoryValue))
            .toList();
    }

    public EventDto.EventResponse getEventById(Long id) {
        return EVENTS.stream()
            .filter(event -> event.getId().equals(id))
            .findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
    }

    public List<EventDto.CategoryResponse> getCategories() {
        return EVENTS.stream()
            .collect(java.util.stream.Collectors.groupingBy(EventDto.EventResponse::getCategory, java.util.stream.Collectors.counting()))
            .entrySet()
            .stream()
            .sorted(Map.Entry.comparingByKey())
            .map(entry -> new EventDto.CategoryResponse(entry.getKey(), entry.getValue()))
            .toList();
    }

    public List<EventDto.VenueResponse> getVenues() {
        return EVENTS.stream()
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

    private boolean matchesSearch(EventDto.EventResponse event, String search) {
        if (search.isBlank()) {
            return true;
        }

        return contains(event.getTitle(), search)
            || contains(event.getCategory(), search)
            || contains(event.getCity(), search)
            || contains(event.getVenue(), search);
    }

    private boolean matchesCategory(EventDto.EventResponse event, String category) {
        return category.isBlank() || event.getCategory().equalsIgnoreCase(category);
    }

    private boolean contains(String value, String search) {
        return value.toLowerCase(Locale.ROOT).contains(search);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }
}
