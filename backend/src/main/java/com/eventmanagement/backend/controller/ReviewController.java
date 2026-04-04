package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.dto.ReviewRequest;
import com.eventmanagement.backend.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public List<Map<String, Object>> getReviews() {
        return reviewService.getReviews();
    }

    @PostMapping
    public Map<String, Object> addReview(@Valid @RequestBody ReviewRequest request, HttpServletRequest httpRequest) {
        return reviewService.addReview(request, httpRequest);
    }
}
