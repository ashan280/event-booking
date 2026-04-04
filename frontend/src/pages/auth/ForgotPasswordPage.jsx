import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setMessage("Enter your email first.");
      return;
    }

    setMessage("Reset password page is ready. Backend reset flow can be added later.");
  }

  return (
    <main className="home-page">
      <section className="simple-panel auth-form-panel">
        <p className="section-tag">Member 1 Module</p>
        <h1>Forgot Password</h1>
        <p>This page is ready for the password reset flow.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <button type="submit" className="primary-link">
            Send reset link
          </button>
        </form>

        {message ? <p className="success-text">{message}</p> : null}

        <p className="helper-text">
          Continue to <Link to="/auth/reset-password">reset password</Link>
        </p>

        <p className="helper-text">
          Back to <Link to="/auth/login">login</Link>
        </p>
      </section>
    </main>
  );
}

export default ForgotPasswordPage;
