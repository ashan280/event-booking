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
      title="Sign in to your account."
      description="Use your email and password to open your account."
      sideTitle="Login steps"
      sideText="Sign in and open your account pages."
      sideItems={[
        "Enter your email and password.",
        "Open your profile after login.",
        "Use reviews after you sign in."
      ]}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800" htmlFor="login-email">
            Email
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            id="login-email"
            name="email"
            type="email"
            placeholder="name@email.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800" htmlFor="login-password">
            Password
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            id="login-password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          className="inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {error ? (
        <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
        <span>New here?</span>
        <Link className="font-semibold text-orange-700 hover:text-orange-800" to="/auth/register">
          Create an account
        </Link>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
        <span>Forgot your password?</span>
        <Link className="font-semibold text-orange-700 hover:text-orange-800" to="/auth/forgot-password">
          Start recovery
        </Link>
      </div>
    </AuthPageShell>
  );
}

export default LoginPage;
