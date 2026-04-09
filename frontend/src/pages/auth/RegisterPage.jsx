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
      navigate("/auth/profile");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthPageShell
      eyebrow="Register"
      title="Create account."
      description="Create an account and sign in."
      sideTitle="Events"
      sideText="Create an account and start booking events."
      sideItems={[
        {
          tag: "Latest",
          title: "New events",
          text: "Check the latest events and pick what you want to book.",
          link: "/events",
          label: "View events"
        },
        {
          tag: "Account",
          title: "Save your tickets",
          text: "Your account keeps your profile, bookings, and tickets together.",
          link: "/auth/login",
          label: "Already have an account?"
        }
      ]}
      sideNote="Create an account so you can book seats, open ticket pages, and return to your bookings later."
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
