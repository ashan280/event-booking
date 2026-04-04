package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.ReviewDto;
import com.eventmanagement.backend.model.Review;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.ReviewRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final AuthService authService;

    public List<ReviewDto.ReviewResponse> getReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(this::reviewDetails)
            .toList();
    }

    public ReviewDto.ReviewResponse addReview(ReviewDto.ReviewRequest request, HttpServletRequest httpRequest) {
        User user = authService.getCurrentUser(httpRequest);

        Review review = new Review();
        review.setUser(user);
        review.setRating(request.getRating());
        review.setComment(request.getComment().trim());

        Review savedReview = reviewRepository.save(review);
        return new ReviewDto.ReviewResponse(
            "Review added",
            savedReview.getId(),
            savedReview.getUser().getFullName(),
            savedReview.getRating(),
            savedReview.getComment(),
            savedReview.getCreatedAt()
        );
    }

    private ReviewDto.ReviewResponse reviewDetails(Review review) {
        return new ReviewDto.ReviewResponse(
            null,
            review.getId(),
            review.getUser().getFullName(),
            review.getRating(),
            review.getComment(),
            review.getCreatedAt()
        );
    }
}
