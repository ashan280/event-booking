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
            event("Colombo Music Night", "Music", "Lotus Hall", "Colombo", "2026-04-08", "7:00 PM", "LKR 2,500",
                "Live music, local artists, and a full evening show.",
                "Enjoy a full evening with live bands, food stalls, and an easy seat booking flow in Colombo.", 120, "/images/music.png"),
            event("Startup Meetup 2026", "Business", "City Innovation Hub", "Kandy", "2026-04-20", "10:00 AM", "Free",
                "A meetup for students, founders, and small teams.",
                "Join talks, networking sessions, and simple startup discussions with local speakers and student founders.", 80, "/images/business.png"),
            event("Food Festival Weekend", "Food & Drink", "Ocean View Grounds", "Galle", "2026-04-28", "4:00 PM", "LKR 1,200",
                "Street food, music, and family fun by the coast.",
                "Taste local food, watch live cooking, and enjoy a relaxed weekend event with family and friends.", 200, "/images/food.png"),
            event("Creative Design Workshop", "Workshops", "Studio 8", "Colombo", "2026-05-03", "1:00 PM", "LKR 3,000",
                "A hands-on design session for beginners.",
                "Learn design basics, layout ideas, and team project tips in a guided workshop for beginners.", 35, "/images/workshop.png")
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
