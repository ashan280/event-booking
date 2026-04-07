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
      title="Reset your password."
      description="Enter your email and go to the next step."
      sideTitle="Reset"
      sideText="Start the password reset."
      sideItems={[
        "Enter the email linked to your account.",
        "Use the reset token.",
        "Set a new password on the next page."
      ]}
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
