package com.eventmanagement.backend.dto;

import lombok.Getter;

@Getter
public class ForgotPasswordResponse extends ApiMessageResponse {

    private final String resetToken;

    public ForgotPasswordResponse(String message, String resetToken) {
        super(message);
        this.resetToken = resetToken;
    }
}
