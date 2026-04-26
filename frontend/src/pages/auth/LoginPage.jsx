import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthPageShell from "../../components/AuthPageShell";
import { saveAuth } from "../../lib/auth";
import { apiRequest } from "../../lib/api";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
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
    setIsLoading(true);
    setError("");

    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(formData)
      });

      saveAuth(data);
      navigate("/auth");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthPageShell
      eyebrow="Login"
      title="Welcome back"
      description="Sign in to manage bookings, open tickets, and keep exploring upcoming events."
      sideTitle="Events"
      sideText="Jump back in and pick up where you left off."
      sideItems={[
        {
          tag: "Latest",
          title: "Fresh events",
          text: "Browse new events, updated dates, and venues before you book.",
          link: "/events",
          label: "View events"
        },
        {
          tag: "Venues",
          title: "Venue guides",
          text: "Look through venues first if you want a better feel for the location.",
          link: "/venues",
          label: "View venues"
        }
      ]}
      sideNote="Sign in to book seats, keep your ticket handy, and come back to your bookings whenever you need."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="login-email">
          Email
          <input
            id="login-email"
            name="email"
            type="email"
            placeholder="name@email.com"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="login-password">
          Password
          <input
            id="login-password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <button
          className="primary-link auth-submit"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="inline-link-list">
        <span>New here?</span>
        <Link to="/auth/register">
          Create an account
        </Link>
      </div>

      <div className="inline-link-list">
        <span>Forgot your password?</span>
        <Link to="/auth/forgot-password">
          Start recovery
        </Link>
      </div>
    </AuthPageShell>
  );
}

export default LoginPage;
