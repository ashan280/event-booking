import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import AuthPageShell from "../../components/AuthPageShell";
import { apiRequest } from "../../lib/api";

function ResetPasswordPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    token: searchParams.get("token") || "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState(location.state?.message || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!formData.token.trim()) {
      setError("Reset token is required.");
      return;
    }

    if (!formData.password.trim() || !formData.confirmPassword.trim()) {
      setError("Fill in both password fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Use at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token: formData.token,
          password: formData.password
        })
      });

      setMessage(data.message);
      setFormData((current) => ({
        ...current,
        password: "",
        confirmPassword: ""
      }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthPageShell
      eyebrow="Reset Password"
      title="Set a new password."
      description="Enter your token, add a new password, and save it."
      sideTitle="Reset"
      sideText="Add your token and new password."
      sideItems={[
        "Use the token from the last step.",
        "Enter a password with at least 6 characters.",
        "Confirm it before saving.",
        "Use the new password when you sign in again."
      ]}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="reset-token">
            Reset token
          
          <input
            id="reset-token"
            name="token"
            type="text"
            placeholder="Paste your reset token"
            value={formData.token}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="reset-password">
            New password
          
          <input
            id="reset-password"
            name="password"
            type="password"
            placeholder="Enter new password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="reset-confirm-password">
            Confirm password
          
          <input
            id="reset-confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </label>

        <button
          className="primary-link auth-submit"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Updating password..." : "Update password"}
        </button>
      </form>

      {message ? <p className="success-text">{message}</p> : null}

      {error ? <p className="error-text">{error}</p> : null}

      <div className="inline-link-list">
        <span>Need the recovery step first?</span>
        <Link to="/auth/forgot-password">
          Go back
        </Link>
      </div>
    </AuthPageShell>
  );
}

export default ResetPasswordPage;
