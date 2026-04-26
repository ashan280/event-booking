package com.eventmanagement.backend.config;

import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedEvents();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        User admin = new User();
        admin.setFullName("Admin User");
        admin.setEmail("admin@eventhub.com");
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        admin.setRole("ROLE_ADMIN");
        userRepository.save(admin);

        User user = new User();
        user.setFullName("John Doe");
        user.setEmail("user@eventhub.com");
        user.setPasswordHash(passwordEncoder.encode("user123"));
        user.setRole("ROLE_USER");
        userRepository.save(user);
    }

    private void seedEvents() {
        if (eventRepository.count() > 0) return;

        List<Event> events = List.of(
            event("Summer Music Festival 2026", "Music", "Hyde Park Amphitheatre", "London",
                "2026-06-15", "18:00", "£45.00",
                "The biggest outdoor music festival of the summer season.",
                "Join us for an unforgettable evening of live music featuring top artists across multiple stages. Food stalls, art installations, and family-friendly activities make this a complete summer experience.",
                200, null),

            event("Tech Innovation Summit", "Conference", "ExCeL London", "London",
                "2026-07-10", "09:00", "£120.00",
                "Europe's leading technology and innovation conference.",
                "Three days of keynotes, workshops, and networking with industry leaders from AI, fintech, green tech, and more. Includes access to exhibition hall with 200+ exhibitors.",
                500, null),

            event("Shakespeare in the Park", "Theatre", "Regent's Park Open Air Theatre", "London",
                "2026-06-28", "19:30", "£25.00",
                "A Midsummer Night's Dream performed under the stars.",
                "Experience the magic of Shakespeare performed in the open air. Our acclaimed production of A Midsummer Night's Dream brings the Bard's beloved comedy to life with stunning costumes and live music.",
                300, null),

            event("Street Food & Culture Fair", "Food & Drink", "Southbank Centre", "London",
                "2026-07-05", "11:00", "Free",
                "Celebrating global cuisines and cultural diversity.",
                "Explore over 80 street food vendors from around the world, live cooking demonstrations, music performances, and cultural exhibitions. Free entry, pay only for food.",
                1000, null),

            event("Contemporary Art Exhibition", "Arts", "Tate Modern", "London",
                "2026-07-20", "10:00", "£18.00",
                "New works from 30 emerging and established contemporary artists.",
                "A curated exhibition exploring themes of identity, technology, and nature through painting, sculpture, digital media, and installation art. Guided tours available daily.",
                150, null),

            event("Half Marathon City Run", "Sports", "Victoria Embankment", "London",
                "2026-08-02", "07:30", "£35.00",
                "Scenic 21km route through central London landmarks.",
                "Run through the heart of London passing iconic landmarks including Tower Bridge, St Paul's Cathedral, and Buckingham Palace. Suitable for all abilities with 3-hour cut-off time.",
                400, null),

            event("Jazz & Blues Night", "Music", "Ronnie Scott's Jazz Club", "London",
                "2026-06-20", "20:00", "£30.00",
                "An intimate evening of world-class jazz and blues.",
                "Enjoy performances from internationally renowned jazz and blues musicians in London's most famous jazz club. Dinner packages available. Smart casual dress code.",
                80, null),

            event("International Film Festival", "Film", "BFI Southbank", "London",
                "2026-09-12", "10:00", "£15.00",
                "Screenings of award-winning films from 40 countries.",
                "Five days of premieres, retrospectives, and panel discussions celebrating world cinema. Q&A sessions with directors and actors after selected screenings.",
                250, null),

            event("Startup Pitch Competition", "Business", "Here East, Queen Elizabeth Olympic Park", "London",
                "2026-08-18", "10:00", "£20.00",
                "Watch 20 startups compete for £100,000 in funding.",
                "The most exciting startup competition in the UK. Watch the UK's hottest startups pitch to a panel of top investors. Networking drinks reception included after the final.",
                350, null),

            event("Comedy Gala Night", "Comedy", "O2 Arena", "London",
                "2026-07-25", "19:00", "£55.00",
                "Five top comedians for one unmissable night of laughter.",
                "An incredible line-up of the UK's best stand-up comedians performing their latest material. Bar and food available throughout the evening. Strictly 18+ event.",
                600, null)
        );

        eventRepository.saveAll(events);
    }

    private Event event(String title, String category, String venue, String city,
                        String date, String time, String price,
                        String shortDescription, String description,
                        int seats, String imageUrl) {
        Event e = new Event();
        e.setTitle(title);
        e.setCategory(category);
        e.setVenue(venue);
        e.setCity(city);
        e.setDate(date);
        e.setTime(time);
        e.setPrice(price);
        e.setShortDescription(shortDescription);
        e.setDescription(description);
        e.setAvailableSeats(seats);
        e.setImageUrl(imageUrl);
        return e;
    }
}
