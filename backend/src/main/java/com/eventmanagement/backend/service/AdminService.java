package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.AdminDto;
import com.eventmanagement.backend.model.Booking;
import com.eventmanagement.backend.repository.BookingRepository;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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

    public AdminDto.BookingReportResponse getBookingReport(HttpServletRequest request) {
        authService.requireAdmin(request);

        long confirmedBookings = 0;
        long cancelledBookings = 0;
        long totalSeatsBooked = 0;
        BigDecimal totalRevenue = BigDecimal.ZERO;
        Map<String, CityReportData> cityDataMap = new LinkedHashMap<>();

        for (Booking booking : bookingRepository.findAll()) {
            if ("CANCELLED".equalsIgnoreCase(booking.getBookingStatus())) {
                cancelledBookings += 1;
                continue;
            }

            confirmedBookings += 1;
            totalSeatsBooked += booking.getSeatCount();

            String city = booking.getEvent().getCity();
            CityReportData cityData = cityDataMap.computeIfAbsent(city, ignored -> new CityReportData());
            cityData.bookingCount += 1;
            cityData.seatsBooked += booking.getSeatCount();

            if ("PAID".equalsIgnoreCase(booking.getPaymentStatus())) {
                totalRevenue = totalRevenue.add(booking.getTotalAmount());
                cityData.revenue = cityData.revenue.add(booking.getTotalAmount());
            }
        }

        List<AdminDto.CitySummary> citySummaries = cityDataMap.entrySet().stream()
            .map(entry -> new AdminDto.CitySummary(
                entry.getKey(),
                entry.getValue().bookingCount,
                entry.getValue().seatsBooked,
                entry.getValue().revenue
            ))
            .toList();

        return new AdminDto.BookingReportResponse(
            bookingRepository.count(),
            confirmedBookings,
            cancelledBookings,
            totalSeatsBooked,
            totalRevenue,
            citySummaries,
            bookingService.getRecentBookings()
        );
    }

    private static class CityReportData {

        private long bookingCount;
        private long seatsBooked;
        private BigDecimal revenue = BigDecimal.ZERO;
    }
}
