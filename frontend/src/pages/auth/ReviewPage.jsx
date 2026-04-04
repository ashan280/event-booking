import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <main className="home-page">
      <section className="simple-panel auth-form-panel">
        <p className="section-tag">Member 1 Module</p>
        <h1>User Reviews</h1>
        <p>Logged in users can add a simple review here.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Rating
            <select
              className="auth-select"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            >
              <option value="5">5 - Very good</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Fine</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Very poor</option>
            </select>
          </label>

          <label>
            Comment
            <textarea
              className="auth-textarea"
              name="comment"
              placeholder="Write your review"
              value={formData.comment}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="primary-link" disabled={isSaving}>
            {isSaving ? "Saving..." : "Add review"}
          </button>
        </form>

        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        <div className="auth-link-list">
          <Link className="primary-link secondary-link" to="/auth">
            Back to auth home
          </Link>
        </div>
      </section>

      <section className="simple-panel auth-form-panel">
        <p className="section-tag">Review List</p>
        <h2>Recent reviews</h2>

        {isLoading ? <p className="helper-text">Loading reviews...</p> : null}

        {!isLoading && reviews.length === 0 ? (
          <p className="helper-text">No reviews yet.</p>
        ) : null}

        <div className="review-list">
          {reviews.map((review) => (
            <article className="review-card" key={review.id}>
              <strong>{review.fullName}</strong>
              <p className="review-rating">Rating: {review.rating}/5</p>
              <p>{review.comment}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ReviewPage;
