import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthPageShell from "../../components/AuthPageShell";
import { apiRequest } from "../../lib/api";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });

      navigate(`/auth/reset-password?token=${encodeURIComponent(data.resetToken)}`, {
        state: {
          message: "Reset link created. You can set a new password now."
        }
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthPageShell
      eyebrow="Forgot password"
      title="Reset your password"
      description="Enter your email and we’ll help you move to the password reset step."
      sideTitle="Account help"
      sideText="Get back into your account and keep your plans moving."
      sideItems={[
        {
          tag: "Account",
          title: "Keep your bookings safe",
          text: "Recover your account if you need access to saved tickets or older bookings.",
          link: "/auth/login",
          label: "Back to sign in"
        },
        {
          tag: "Events",
          title: "Back to events",
          text: "Once your password is sorted, you can head straight back to the event list.",
          link: "/events",
          label: "View events"
        }
      ]}
      sideNote="This step helps you get back into your account so your bookings and tickets are still easy to reach."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="forgot-email">
          Email address
          <input
            id="forgot-email"
            type="email"
            placeholder="name@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <button
          className="primary-link auth-submit"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Sending link..." : "Send recovery link"}
        </button>
      </form>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="inline-link-list">
        <span>Ready to continue?</span>
        <Link to="/auth/reset-password">
          Go to reset password
        </Link>
      </div>

      <div className="inline-link-list">
        <span>Remembered it?</span>
        <Link to="/auth/login">
          Back to sign in
        </Link>
      </div>
    </AuthPageShell>
  );
}

export default ForgotPasswordPage;
