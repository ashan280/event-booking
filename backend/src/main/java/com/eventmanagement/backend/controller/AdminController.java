package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.dto.AdminDto;
import com.eventmanagement.backend.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public AdminDto.DashboardResponse getDashboard(HttpServletRequest request) {
        return adminService.getDashboard(request);
    }

    @GetMapping("/bookings/report")
    public AdminDto.BookingReportResponse getBookingReport(HttpServletRequest request) {
        return adminService.getBookingReport(request);
    }
}
