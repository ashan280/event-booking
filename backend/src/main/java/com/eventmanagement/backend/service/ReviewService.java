package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.ReviewRequest;
import com.eventmanagement.backend.model.Review;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.ReviewRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final AuthService authService;

    public List<Map<String, Object>> getReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(this::reviewDetails)
            .toList();
    }

    public Map<String, Object> addReview(ReviewRequest request, HttpServletRequest httpRequest) {
        User user = authService.getCurrentUser(httpRequest);

        Review review = new Review();
        review.setUser(user);
        review.setRating(request.getRating());
        review.setComment(request.getComment().trim());

        Review savedReview = reviewRepository.save(review);
        Map<String, Object> response = reviewDetails(savedReview);
        response.put("message", "Review added");
        return response;
    }

    private Map<String, Object> reviewDetails(Review review) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", review.getId());
        response.put("fullName", review.getUser().getFullName());
        response.put("rating", review.getRating());
        response.put("comment", review.getComment());
        response.put("createdAt", review.getCreatedAt());
        return response;
    }
}
