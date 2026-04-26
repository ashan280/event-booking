import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthPageShell from "../../components/AuthPageShell";
import { saveAuth } from "../../lib/auth";
import { apiRequest } from "../../lib/api";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
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
      const data = await apiRequest("/api/auth/register", {
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
      eyebrow="Register"
      title="Create your account"
      description="Set up your account once and keep all your bookings, tickets, and event plans together."
      sideTitle="Events"
      sideText="A quick account setup makes every booking easier."
      sideItems={[
        {
          tag: "Latest",
          title: "New events",
          text: "See what is coming up and save the events you want to book next.",
          link: "/events",
          label: "View events"
        },
        {
          tag: "Account",
          title: "Keep everything together",
          text: "Your profile, bookings, and tickets stay in one simple place.",
          link: "/auth/login",
          label: "Already registered?"
        }
      ]}
      sideNote="Create an account to book seats, pay faster, and come back to your tickets later without hassle."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="register-name">
          Full name
          <input
            id="register-name"
            name="fullName"
            type="text"
            placeholder="Your full name"
            value={formData.fullName}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="register-email">
          Email
          <input
            id="register-email"
            name="email"
            type="email"
            placeholder="name@email.com"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="register-password">
          Password
          <input
            id="register-password"
            name="password"
            type="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <button
          className="primary-link auth-submit"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="inline-link-list">
        <span>Already registered?</span>
        <Link to="/auth/login">
          Sign in here
        </Link>
      </div>
    </AuthPageShell>
  );
}

export default RegisterPage;
