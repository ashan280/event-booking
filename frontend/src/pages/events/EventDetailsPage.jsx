import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageIntro from "../../components/PageIntro";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import { apiRequest } from "../../lib/api";
import { getAuth, isAdmin } from "../../lib/auth";
import { DEFAULT_EVENT_IMAGE } from "../../lib/constants";

function formatReviewDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString();
}

function EventDetailsPage() {
  const navigate = useNavigate();
  const auth = getAuth();
  const canManageEvents = isAdmin(auth);
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    rating: "5",
    comment: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [activeReviewId, setActiveReviewId] = useState(null);
  const reviewCountLabel = `${reviews.length} review${reviews.length === 1 ? "" : "s"}`;

  useEffect(() => {
    async function loadEvent() {
      setIsLoading(true);
      setError("");

      try {
        const data = await apiRequest(`/api/events/${eventId}`);
        setEvent(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
    loadReviews();
  }, [eventId]);

  async function loadReviews() {
    setIsReviewsLoading(true);
    setReviewError("");

    try {
      const data = await apiRequest(`/api/reviews?eventId=${eventId}`);
      setReviews(data);
    } catch (requestError) {
      setReviewError(requestError.message);
    } finally {
      setIsReviewsLoading(false);
    }
  }

  function handleReviewChange(event) {
    const { name, value } = event.target;
    setReviewForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleDelete() {
    const confirmed = window.confirm("Do you want to delete this event?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await apiRequest(`/api/events/${eventId}`, {
        method: "DELETE",
        auth: true
      });

      navigate("/events");
    } catch (requestError) {
      setError(requestError.message);
      setIsDeleting(false);
    }
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();

    if (!auth?.token) {
      navigate("/auth/login");
      return;
    }

    if (!reviewForm.comment.trim()) {
      setReviewError("Write a review comment");
      return;
    }

    setIsSavingReview(true);
    setReviewError("");
    setReviewMessage("");

    try {
      const data = await apiRequest("/api/reviews", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          eventId: Number(eventId),
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment
        })
      });

      setReviewMessage(data.message);
      setReviewForm({
        rating: "5",
        comment: ""
      });
      await loadReviews();
    } catch (requestError) {
      setReviewError(requestError.message);
    } finally {
      setIsSavingReview(false);
    }
  }

  async function handleReviewDelete(reviewId) {
    const confirmed = window.confirm("Do you want to delete this review?");

    if (!confirmed) {
      return;
    }

    setActiveReviewId(reviewId);
    setReviewError("");
    setReviewMessage("");

    try {
      const data = await apiRequest(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        auth: true
      });

      setReviewMessage(data.message);
      await loadReviews();
    } catch (requestError) {
      setReviewError(requestError.message);
    } finally {
      setActiveReviewId(null);
    }
  }

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        {event ? (
          <PageIntro
            eyebrow={event.category}
            title={event.title}
            description={event.shortDescription}
            actions={(
              <>
                <Link className="ghost-link" to="/events">
                  Back to events
                </Link>
                {canManageEvents ? (
                  <Link className="ghost-link" to="/events/create">
                    Add event
                  </Link>
                ) : null}
                {canManageEvents ? (
                  <Link className="ghost-link" to={`/events/${event.id}/edit`}>
                    Edit event
                  </Link>
                ) : null}
              </>
            )}
          />
        ) : null}

        {isLoading ? <section className="simple-panel"><p>Loading event details...</p></section> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {event ? (
          <section className="event-details-layout">
            <div className="event-details-main">
              <div className="event-details-image simple-event-image">
                <img
                  className="event-details-photo"
                  src={event.imageUrl || DEFAULT_EVENT_IMAGE}
                  alt={event.title}
                />
                <span className="event-image-badge">{event.category}</span>
              </div>

              <div className="event-details-box">
                <p className="section-tag">About this event</p>
                <h2 className="panel-title">Event overview</h2>
                <p>{event.description}</p>
              </div>

              <div className="event-details-box">
                <p className="section-tag">Details</p>
                <h2 className="panel-title">Event information</h2>
                <div className="booking-detail-grid">
                  <article className="booking-detail-card">
                    <span className="booking-detail-label">Date</span>
                    <strong className="booking-detail-value">{event.date}</strong>
                  </article>
                  <article className="booking-detail-card">
                    <span className="booking-detail-label">Time</span>
                    <strong className="booking-detail-value">{event.time}</strong>
                  </article>
                  <article className="booking-detail-card">
                    <span className="booking-detail-label">City</span>
                    <strong className="booking-detail-value">{event.city}</strong>
                  </article>
                  <article className="booking-detail-card">
                    <span className="booking-detail-label">Venue</span>
                    <strong className="booking-detail-value">{event.venue}</strong>
                  </article>
                  <article className="booking-detail-card">
                    <span className="booking-detail-label">Price</span>
                    <strong className="booking-detail-value">{event.price}</strong>
                  </article>
                  <article className="booking-detail-card">
                    <span className="booking-detail-label">Seats left</span>
                    <strong className="booking-detail-value">{event.availableSeats}</strong>
                  </article>
                </div>
              </div>

              <div className="event-details-box event-review-panel">
                <div className="page-actions review-panel-head">
                  <div>
                    <p className="section-tag">Reviews</p>
                    <h2 className="panel-title">Reviews for this event</h2>
                    <p className="helper-text">Read what others thought or share your own experience after booking.</p>
                  </div>
                  <span className="account-badge review-count-badge">{reviewCountLabel}</span>
                </div>

                {auth?.token ? (
                  <form className="event-review-form" onSubmit={handleReviewSubmit}>
                    <div className="event-review-form-grid">
                      <div className="event-review-side">
                        <label className="event-review-field">
                          Rating
                          <select
                            name="rating"
                            value={reviewForm.rating}
                            onChange={handleReviewChange}
                          >
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Good</option>
                            <option value="3">3 - Okay</option>
                            <option value="2">2 - Poor</option>
                            <option value="1">1 - Very poor</option>
                          </select>
                        </label>
                        <button className="primary-link" type="submit" disabled={isSavingReview}>
                          {isSavingReview ? "Saving..." : "Save review"}
                        </button>
                      </div>
                      <label className="event-review-field event-review-comment">
                        Comment
                        <textarea
                          className="auth-textarea"
                          name="comment"
                          placeholder="Share your experience with this event"
                          value={reviewForm.comment}
                          onChange={handleReviewChange}
                        />
                      </label>
                    </div>
                  </form>
                ) : (
                  <div className="booking-note-box">
                    <strong>Want to post a review?</strong>
                    <p>Sign in first and you’ll be able to leave a review for this event.</p>
                    <Link className="ghost-link" to="/auth/login">
                      Sign in
                    </Link>
                  </div>
                )}

                {reviewMessage ? <p className="success-text">{reviewMessage}</p> : null}
                {reviewError ? <p className="error-text">{reviewError}</p> : null}

                {isReviewsLoading ? (
                  <p className="helper-text">Loading reviews...</p>
                ) : null}

                {!isReviewsLoading && reviews.length === 0 ? (
                  <p className="helper-text">No reviews for this event yet.</p>
                ) : null}

                <div className="review-list">
                  {reviews.map((review) => (
                    <article className="review-card" key={review.id}>
                      <div className="review-card-head">
                        <div>
                          <div className="review-name-row">
                            <strong className="panel-title">{review.fullName}</strong>
                            {auth?.id === review.userId ? (
                              <span className="account-badge">Your review</span>
                            ) : null}
                          </div>
                          {review.createdAt ? (
                            <p className="helper-text review-date-text">{formatReviewDate(review.createdAt)}</p>
                          ) : null}
                        </div>
                        <span className="account-badge">{review.rating}/5</span>
                      </div>
                      <div className="review-card-body">
                        <p>{review.comment}</p>
                      </div>
                      {auth?.id === review.userId ? (
                        <div className="review-card-actions">
                          <button
                            className="delete-link"
                            type="button"
                            onClick={() => handleReviewDelete(review.id)}
                            disabled={activeReviewId === review.id}
                          >
                            {activeReviewId === review.id ? "Deleting..." : "Delete review"}
                          </button>
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <aside className="event-details-side">
              <div className="event-details-box">
                <p className="section-tag">Booking</p>
                <h2 className="panel-title">Book this event</h2>
                <div className="booking-quick-grid">
                  <div className="booking-total-box">
                    <p>Price</p>
                    <strong>{event.price}</strong>
                  </div>
                  <div className="booking-total-box">
                    <p>Seats left</p>
                    <strong>{event.availableSeats}</strong>
                  </div>
                </div>
                <div className="booking-note-box">
                  <strong>Before you continue</strong>
                  <p>Sign in first if you want to book this event and keep the ticket saved in your account.</p>
                </div>
                <Link className="primary-link" to={`/booking/${event.id}`}>
                  Book now
                </Link>
              </div>

              {canManageEvents ? (
                <div className="event-details-box">
                  <p className="section-tag">Manage</p>
                  <h2 className="panel-title">Manage event</h2>
                  <p>You can edit this event or remove it from the event list.</p>
                  <div className="auth-link-list">
                    <Link className="ghost-link" to={`/events/${event.id}/edit`}>
                      Edit event
                    </Link>
                    <button
                      className="ghost-link delete-link"
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete event"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="event-details-box">
                  <p className="section-tag">Admin</p>
                  <h2 className="panel-title">Event updates</h2>
                  <p>Admins can update this event from the admin dashboard.</p>
                </div>
              )}
            </aside>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default EventDetailsPage;
