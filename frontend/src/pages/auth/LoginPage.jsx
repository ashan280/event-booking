import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveAuth } from "../../lib/auth";
import { apiRequest } from "../../lib/api";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
      const data = await apiRequest("/api/auth/login", {
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
        <h1>Login</h1>
        <p>Login with your email and password.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="primary-link" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        <p className="helper-text">
          New user? <Link to="/auth/register">Create an account</Link>
        </p>
        <p className="helper-text">
          Forgot password? <Link to="/auth/forgot-password">Reset here</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
