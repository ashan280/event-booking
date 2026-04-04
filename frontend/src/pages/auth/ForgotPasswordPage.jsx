import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthPageShell from "../../components/AuthPageShell";
import { apiRequest } from "../../lib/api";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });

      navigate(`/auth/reset-password?token=${encodeURIComponent(data.resetToken)}`, {
        state: {
          message: "Reset link created. You can set a new password now."
        }
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthPageShell
      eyebrow="Forgot password"
      title="Reset your password."
      description="Enter your email and move to the reset step."
      sideTitle="Reset steps"
      sideText="Start the reset process."
      sideItems={[
        "Enter the email linked to your account.",
        "Use the reset link or token.",
        "Set a new password on the next page."
      ]}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800" htmlFor="forgot-email">
            Email address
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            id="forgot-email"
            type="email"
            placeholder="name@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <button
          className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Sending link..." : "Send recovery link"}
        </button>
      </form>

      {error ? (
        <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
        <span>Ready to continue?</span>
        <Link className="font-semibold text-blue-700 hover:text-blue-800" to="/auth/reset-password">
          Go to reset password
        </Link>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
        <span>Remembered it?</span>
        <Link className="font-semibold text-blue-700 hover:text-blue-800" to="/auth/login">
          Back to sign in
        </Link>
      </div>
    </AuthPageShell>
  );
}

export default ForgotPasswordPage;
