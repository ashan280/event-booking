package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.dto.ReviewDto;
import com.eventmanagement.backend.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public List<ReviewDto.ReviewResponse> getReviews(@RequestParam(required = false) Long eventId) {
        return reviewService.getReviews(eventId);
    }

    @PostMapping
    public ReviewDto.ReviewResponse addReview(@Valid @RequestBody ReviewDto.ReviewRequest request, HttpServletRequest httpRequest) {
        return reviewService.addReview(request, httpRequest);
    }

    @DeleteMapping("/{reviewId}")
    public ReviewDto.ReviewResponse deleteReview(@PathVariable Long reviewId, HttpServletRequest httpRequest) {
        return reviewService.deleteReview(reviewId, httpRequest);
    }
}
