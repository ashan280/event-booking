import { useState } from "react";
import { Link } from "react-router-dom";

function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!formData.password.trim() || !formData.confirmPassword.trim()) {
      setError("Fill all password fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must have at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setMessage("Reset password page is ready. Backend reset update can be added later.");
    setFormData({
      password: "",
      confirmPassword: ""
    });
  }

  return (
    <main className="home-page">
      <section className="simple-panel auth-form-panel">
        <p className="section-tag">Member 1 Module</p>
        <h1>Reset Password</h1>
        <p>This page is ready for the new password update flow.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            New password
            <input
              name="password"
              type="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          <label>
            Confirm password
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="primary-link">
            Update password
          </button>
        </form>

        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        <p className="helper-text">
          Back to <Link to="/auth/login">login</Link>
        </p>
      </section>
    </main>
  );
}

export default ResetPasswordPage;
