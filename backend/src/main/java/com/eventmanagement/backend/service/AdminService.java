package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.AdminDto;
import com.eventmanagement.backend.repository.BookingRepository;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashSet;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;

    public AdminDto.DashboardResponse getDashboard(HttpServletRequest request) {
        authService.requireAdmin(request);

        HashSet<String> venueNames = new HashSet<>();
        eventRepository.findAll().forEach(event -> venueNames.add(event.getVenue() + "|" + event.getCity()));

        return new AdminDto.DashboardResponse(
            userRepository.count(),
            eventRepository.count(),
            bookingRepository.count(),
            venueNames.size(),
            bookingService.getRecentBookings()
        );
    }
}
