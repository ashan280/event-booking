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
      navigate("/auth/profile");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthPageShell
      eyebrow="Login"
      title="Sign in."
      description="Use your email and password to open your account."
      sideTitle="Events"
      sideText="Sign in and start using the event pages."
      sideItems={[
        {
          tag: "Latest",
          title: "Latest events",
          text: "Open the event list and check new events, dates, and venues.",
          link: "/events",
          label: "View events"
        },
        {
          tag: "Venues",
          title: "Event places",
          text: "Check venue pages before you book your seats.",
          link: "/venues",
          label: "View venues"
        }
      ]}
      sideNote="Sign in first if you want to book events, open tickets, and check booking history later."
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
