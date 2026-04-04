package com.eventmanagement.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

public final class CommonDto {

    private CommonDto() {
    }

    @Getter
    @AllArgsConstructor
    public static class ErrorResponse {

        private final String message;
    }
}
