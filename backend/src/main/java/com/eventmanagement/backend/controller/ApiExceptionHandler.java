package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.dto.CommonDto;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<CommonDto.ErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
        FieldError firstError = exception.getBindingResult().getFieldErrors().stream().findFirst().orElse(null);
        String message = firstError == null ? "Invalid request" : firstError.getDefaultMessage();
        return ResponseEntity.badRequest().body(new CommonDto.ErrorResponse(message));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<CommonDto.ErrorResponse> handleStatus(ResponseStatusException exception) {
        String message = exception.getReason() == null ? "Request failed" : exception.getReason();
        return ResponseEntity.status(exception.getStatusCode()).body(new CommonDto.ErrorResponse(message));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<CommonDto.ErrorResponse> handleConstraint() {
        return ResponseEntity.badRequest().body(new CommonDto.ErrorResponse("Invalid request"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonDto.ErrorResponse> handleOther() {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new CommonDto.ErrorResponse("Something went wrong"));
    }
}
