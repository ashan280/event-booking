import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthPageShell from "../../components/AuthPageShell";
import { apiRequest } from "../../lib/api";
import { getAuth } from "../../lib/auth";

function ReviewPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    rating: "5",
    comment: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setIsLoading(true);
    setError("");

    try {
      const data = await apiRequest("/api/reviews");
      setReviews(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const auth = getAuth();

    if (!auth?.token) {
      navigate("/auth/login");
      return;
    }

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const data = await apiRequest("/api/reviews", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          rating: Number(formData.rating),
          comment: formData.comment
        })
      });

      setMessage(data.message);
      setFormData({
        rating: "5",
        comment: ""
      });
      await loadReviews();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AuthPageShell
      eyebrow="Reviews"
      title="Reviews."
      description="Post a review and read recent reviews."
      sideTitle="Events"
      sideText="Use reviews together with your event and booking pages."
      sideItems={[
        {
          tag: "Events",
          title: "Back to events",
          text: "Open the event list again after you finish reading reviews.",
          link: "/events",
          label: "View events"
        },
        {
          tag: "Bookings",
          title: "Open tickets",
          text: "Use your booking page if you want to reopen tickets and old bookings.",
          link: "/booking",
          label: "My bookings"
        }
      ]}
      sideNote="Signed-in users can post reviews here, then go back to events, venues, or booking pages."
    >
      <div className="review-layout">
        <section className="detail-panel">
          <h2 className="panel-title">Write a review</h2>
          <p className="helper-text">Share a quick rating and a short comment.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="review-rating">
                Rating
              
              <select
                id="review-rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Okay</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Very poor</option>
              </select>
            </label>

            <label htmlFor="review-comment">
                Comment
              
              <textarea
                className="auth-textarea"
                id="review-comment"
                name="comment"
                placeholder="Write your review"
                value={formData.comment}
                onChange={handleChange}
              />
            </label>

            <button
              className="primary-link auth-submit"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Saving review..." : "Post review"}
            </button>
          </form>

          {message ? <p className="success-text">{message}</p> : null}

          {error ? <p className="error-text">{error}</p> : null}
        </section>

        <section className="detail-panel">
          <div className="page-actions">
            <div>
              <h2 className="panel-title">Recent reviews</h2>
              <p className="helper-text">The newest reviews appear here.</p>
            </div>
            <Link className="ghost-link" to="/auth">
              Back to account
            </Link>
          </div>

          {isLoading ? (
            <p className="helper-text">Loading reviews...</p>
          ) : null}

          {!isLoading && reviews.length === 0 ? (
            <p className="helper-text">No reviews yet.</p>
          ) : null}

          <div className="review-list">
            {reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="page-actions">
                  <strong className="panel-title">{review.fullName}</strong>
                  <span className="account-badge">
                    {review.rating}/5
                  </span>
                </div>
                <p>{review.comment}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AuthPageShell>
  );
}

export default ReviewPage;
