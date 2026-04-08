package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.ReviewDto;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.Review;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.ReviewRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final EventRepository eventRepository;
    private final AuthService authService;

    public List<ReviewDto.ReviewResponse> getReviews(Long eventId) {
        List<Review> reviews = eventId == null
            ? reviewRepository.findAllByOrderByCreatedAtDesc()
            : reviewRepository.findAllByEvent_IdOrderByCreatedAtDesc(eventId);

        return reviews.stream()
            .map(this::reviewDetails)
            .toList();
    }

    public ReviewDto.ReviewResponse addReview(ReviewDto.ReviewRequest request, HttpServletRequest httpRequest) {
        User user = authService.getCurrentUser(httpRequest);
        Event event = eventRepository.findById(request.getEventId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

        Review review = new Review();
        review.setUser(user);
        review.setEvent(event);
        review.setRating(request.getRating());
        review.setComment(request.getComment().trim());

        Review savedReview = reviewRepository.save(review);
        return new ReviewDto.ReviewResponse(
            "Review saved",
            savedReview.getId(),
            savedReview.getEvent().getId(),
            savedReview.getEvent().getTitle(),
            savedReview.getUser().getId(),
            savedReview.getUser().getFullName(),
            savedReview.getRating(),
            savedReview.getComment(),
            savedReview.getCreatedAt()
        );
    }

    public ReviewDto.ReviewResponse deleteReview(Long reviewId, HttpServletRequest httpRequest) {
        User user = authService.getCurrentUser(httpRequest);
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own review");
        }

        reviewRepository.delete(review);

        return new ReviewDto.ReviewResponse(
            "Review deleted",
            reviewId,
            review.getEvent().getId(),
            review.getEvent().getTitle(),
            user.getId(),
            user.getFullName(),
            review.getRating(),
            review.getComment(),
            review.getCreatedAt()
        );
    }

    private ReviewDto.ReviewResponse reviewDetails(Review review) {
        return new ReviewDto.ReviewResponse(
            null,
            review.getId(),
            review.getEvent().getId(),
            review.getEvent().getTitle(),
            review.getUser().getId(),
            review.getUser().getFullName(),
            review.getRating(),
            review.getComment(),
            review.getCreatedAt()
        );
    }
}
