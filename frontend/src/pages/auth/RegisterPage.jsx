import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveAuth } from "../../lib/auth";
import { apiRequest } from "../../lib/api";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
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
    setMessage("");
    setError("");

    try {
      const data = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formData)
      });

      saveAuth(data);
      setMessage(data.message);
      navigate("/auth/profile");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="home-page">
      <section className="simple-panel auth-form-panel">
        <p className="section-tag">Member 1 Module</p>
        <h1>Register</h1>
        <p>Create your account to continue.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="primary-link" disabled={isLoading}>
            {isLoading ? "Creating..." : "Register"}
          </button>
        </form>

        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        <p className="helper-text">
          Already have an account? <Link to="/auth/login">Login here</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
