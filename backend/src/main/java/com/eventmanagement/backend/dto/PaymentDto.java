package com.eventmanagement.backend.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Getter;

public final class PaymentDto {

    private PaymentDto() {
    }

    @Getter
    @AllArgsConstructor
    public static class PayPalConfigResponse {

        private final boolean enabled;
        private final String clientId;
        private final String currency;
        private final String note;
    }

    @Getter
    @AllArgsConstructor
    public static class PayPalOrderResponse {

        private final String orderId;
        private final String currency;
        private final BigDecimal amount;
    }

    @Getter
    @AllArgsConstructor
    public static class PayPalCaptureResponse {

        private final String captureId;
        private final String status;
        private final BookingDto.BookingResponse booking;
    }
}
