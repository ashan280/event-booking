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
      title="Create a new password for your account."
      description="Enter a new password, confirm it, and save your changes."
      sideTitle="Password update"
      sideText="Choose a new password to secure your account."
      sideItems={[
        "Use the reset token from the recovery step.",
        "Enter a new password with at least 6 characters.",
        "Confirm the password before saving.",
        "Use the new password the next time you sign in."
      ]}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800" htmlFor="reset-token">
            Reset token
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            id="reset-token"
            name="token"
            type="text"
            placeholder="Paste your reset token"
            value={formData.token}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800" htmlFor="reset-password">
            New password
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            id="reset-password"
            name="password"
            type="password"
            placeholder="Enter new password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800" htmlFor="reset-confirm-password">
            Confirm password
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            id="reset-confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button
          className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Updating password..." : "Update password"}
        </button>
      </form>

      {message ? (
        <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
        <span>Need the recovery step first?</span>
        <Link className="font-semibold text-blue-700 hover:text-blue-800" to="/auth/forgot-password">
          Go back
        </Link>
      </div>
    </AuthPageShell>
  );
}

export default ResetPasswordPage;
