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
      title="Read feedback and leave your own review."
      description="This screen keeps the review form and recent feedback in one responsive layout so the whole auth area feels consistent."
      sideTitle="Review Flow"
      sideText="Feedback tools inside the account area."
      sideItems={[
        "Only signed-in users can submit a review.",
        "Recent reviews are shown in the same page.",
        "The review feed updates right after posting."
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Write a review</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Share a quick rating and a short comment.
          </p>

          <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800" htmlFor="review-rating">
                Rating
              </label>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
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
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800" htmlFor="review-comment">
                Comment
              </label>
              <textarea
                className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                id="review-comment"
                name="comment"
                placeholder="Write your review"
                value={formData.comment}
                onChange={handleChange}
              />
            </div>

            <button
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Saving review..." : "Post review"}
            </button>
          </form>

          {message ? (
            <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {message}
            </p>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </p>
          ) : null}
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Recent reviews</h2>
              <p className="mt-2 text-sm text-slate-600">
                The newest feedback appears here.
              </p>
            </div>
            <Link className="text-sm font-semibold text-blue-700 hover:text-blue-800" to="/auth">
              Back to account
            </Link>
          </div>

          {isLoading ? (
            <p className="mt-5 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600">
              Loading reviews...
            </p>
          ) : null}

          {!isLoading && reviews.length === 0 ? (
            <p className="mt-5 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600">
              No reviews yet.
            </p>
          ) : null}

          <div className="mt-5 grid gap-4">
            {reviews.map((review) => (
              <article
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
                key={review.id}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <strong className="text-lg font-bold text-slate-950">{review.fullName}</strong>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                    {review.rating}/5
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AuthPageShell>
  );
}

export default ReviewPage;
