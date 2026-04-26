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
                "Beginner-friendly workshop covering HTML, CSS, and React basics.", 70, "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&q=80"),
            event("Young Professionals Meetup", "Networking", "The Convention Centre Dublin", "Dublin", "2026-05-14", "6:00 PM - 9:00 PM", "EUR 8",
                "Organizer: Career Connect",
                "Connect with graduates, startups, and recruiters in Dublin.", 120, "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"),
            event("Outdoor Acoustic Night", "Music", "St Stephen's Green", "Dublin", "2026-06-02", "5:00 PM - 9:00 PM", "EUR 5",
                "Organizer: Dublin Music Circle",
                "Live acoustic performances by local student artists.", 250, "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80"),
            event("Student Fitness Bootcamp", "Sports", "Phoenix Park", "Dublin", "2026-05-18", "8:00 AM - 10:00 AM", "Free",
                "Organizer: Fit Students Ireland",
                "Group workout session including cardio and strength training.", 60, "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80"),
            event("Cultural Food Festival", "Cultural", "Temple Bar Square", "Dublin", "2026-05-25", "12:00 PM - 7:00 PM", "EUR 10",
                "Organizer: Global Student Network",
                "Experience international cuisines and cultural performances.", 300, "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80"),
            event("UI/UX Design Crash Course", "Workshop", "Dogpatch Labs", "Dublin", "2026-05-20", "2:00 PM - 6:00 PM", "EUR 12",
                "Organizer: Design Hub Dublin",
                "Learn wireframing, prototyping, and Figma basics.", 50, "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80"),
            event("Summer Rooftop Party", "Social", "The Marker Hotel Rooftop", "Dublin", "2026-06-05", "7:00 PM - 11:30 PM", "EUR 20",
                "Organizer: Student Union Events",
                "Social event with DJ music and networking opportunities.", 180, "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80"),
            event("Career Skills Seminar", "Education", "Dublin City Library & Archive", "Dublin", "2026-05-12", "3:00 PM - 5:00 PM", "Free",
                "Organizer: Dublin Youth Services",
                "Learn CV writing, interview tips, and job search strategies.", 90, "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80")
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
