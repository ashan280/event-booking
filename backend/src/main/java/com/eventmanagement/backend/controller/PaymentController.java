package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.dto.BookingDto;
import com.eventmanagement.backend.dto.PaymentDto;
import com.eventmanagement.backend.service.PayPalService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments/paypal")
@RequiredArgsConstructor
public class PaymentController {

    private final PayPalService payPalService;

    @GetMapping("/config")
    public PaymentDto.PayPalConfigResponse getPayPalConfig() {
        return payPalService.getConfig();
    }

    @PostMapping("/orders")
    public PaymentDto.PayPalOrderResponse createPayPalOrder(
        @Valid @RequestBody BookingDto.BookingRequest bookingRequest,
        HttpServletRequest request
    ) {
        return payPalService.createOrder(request, bookingRequest);
    }

    @PostMapping("/orders/{orderId}/capture")
    public PaymentDto.PayPalCaptureResponse capturePayPalOrder(
        @PathVariable String orderId,
        @Valid @RequestBody BookingDto.BookingRequest bookingRequest,
        HttpServletRequest request
    ) {
        return payPalService.captureOrder(request, orderId, bookingRequest);
    }
}
