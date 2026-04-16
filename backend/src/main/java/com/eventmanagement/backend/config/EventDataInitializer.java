package com.eventmanagement.backend.config;

import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EventDataInitializer implements CommandLineRunner {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedEvents();
        seedAdminUser();
    }

    private void seedEvents() {
        if (eventRepository.count() > 0) {
            return;
        }

        eventRepository.saveAll(List.of(
            event("Intro to Web Development Workshop", "Technology", "The Digital Hub", "Dublin", "2026-05-10", "11:00 AM - 3:00 PM", "Free",
                "Organizer: Student Tech Community",
                "Beginner-friendly workshop covering HTML, CSS, and React basics.", 70, "/images/workshop.png"),
            event("Young Professionals Meetup", "Networking", "The Convention Centre Dublin", "Dublin", "2026-05-14", "6:00 PM - 9:00 PM", "EUR 8",
                "Organizer: Career Connect",
                "Connect with graduates, startups, and recruiters in Dublin.", 120, "/images/conference.png"),
            event("Outdoor Acoustic Night", "Music", "St Stephen's Green", "Dublin", "2026-06-02", "5:00 PM - 9:00 PM", "EUR 5",
                "Organizer: Dublin Music Circle",
                "Live acoustic performances by local student artists.", 250, "/images/concert.png"),
            event("Student Fitness Bootcamp", "Sports", "Phoenix Park", "Dublin", "2026-05-18", "8:00 AM - 10:00 AM", "Free",
                "Organizer: Fit Students Ireland",
                "Group workout session including cardio and strength training.", 60, "/images/sports.png"),
            event("Cultural Food Festival", "Cultural", "Temple Bar Square", "Dublin", "2026-05-25", "12:00 PM - 7:00 PM", "EUR 10",
                "Organizer: Global Student Network",
                "Experience international cuisines and cultural performances.", 300, "/images/food.png"),
            event("UI/UX Design Crash Course", "Workshop", "Dogpatch Labs", "Dublin", "2026-05-20", "2:00 PM - 6:00 PM", "EUR 12",
                "Organizer: Design Hub Dublin",
                "Learn wireframing, prototyping, and Figma basics.", 50, "/images/workshop.png"),
            event("Summer Rooftop Party", "Social", "The Marker Hotel Rooftop", "Dublin", "2026-06-05", "7:00 PM - 11:30 PM", "EUR 20",
                "Organizer: Student Union Events",
                "Social event with DJ music and networking opportunities.", 180, "/images/concert.png"),
            event("Career Skills Seminar", "Education", "Dublin City Library & Archive", "Dublin", "2026-05-12", "3:00 PM - 5:00 PM", "Free",
                "Organizer: Dublin Youth Services",
                "Learn CV writing, interview tips, and job search strategies.", 90, "/images/conference.png")
        ));
    }

    private Event event(
        String title,
        String category,
        String venue,
        String city,
        String date,
        String time,
        String price,
        String shortDescription,
        String description,
        Integer availableSeats,
        String imageUrl
    ) {
        Event event = new Event();
        event.setTitle(title);
        event.setCategory(category);
        event.setVenue(venue);
        event.setCity(city);
        event.setDate(date);
        event.setTime(time);
        event.setPrice(price);
        event.setShortDescription(shortDescription);
        event.setDescription(description);
        event.setAvailableSeats(availableSeats);
        event.setImageUrl(imageUrl);
        return event;
    }

    private void seedAdminUser() {
        if (userRepository.findByEmail("admin@eventhub.com").isPresent()) {
            return;
        }

        User admin = new User();
        admin.setFullName("Event Admin");
        admin.setEmail("admin@eventhub.com");
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        userRepository.save(admin);
    }
}
