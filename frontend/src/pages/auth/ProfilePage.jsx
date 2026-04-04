import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthPageShell from "../../components/AuthPageShell";
import { apiRequest } from "../../lib/api";
import { clearAuth, getAuth } from "../../lib/auth";

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString();
}

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    if (!auth?.token) {
      navigate("/auth/login");
      return;
    }

    async function loadProfile() {
      try {
        const data = await apiRequest("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });

        setProfile(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [navigate]);

  function handleLogout() {
    clearAuth();
    navigate("/auth/login");
  }

  return (
    <AuthPageShell
      eyebrow="Your Account"
      title="Your profile and account details in one place."
      description="Review your personal details, account role, status, and profile timeline from a single full-page screen."
      sideTitle="Profile Overview"
      sideText="A clean account view for signed-in users."
      sideItems={[
        "Open protected account details after sign in.",
        "See profile data returned from the backend.",
        "Use quick links to go back or sign out."
      ]}
    >
      {isLoading ? (
        <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600">
          Loading your profile...
        </p>
      ) : null}

      {error ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </p>
      ) : null}

      {profile ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Name
              </p>
              <strong className="mt-2 block text-xl font-bold text-slate-950">
                {profile.fullName}
              </strong>
            </article>
            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Role
              </p>
              <strong className="mt-2 block text-xl font-bold text-slate-950">
                {profile.role}
              </strong>
            </article>
            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Account ID
              </p>
              <strong className="mt-2 block text-xl font-bold text-slate-950">
                #{profile.id}
              </strong>
            </article>
          </div>

          <div className="mt-5 grid gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-950">Account details</h2>
              <p className="text-sm text-slate-600"><strong className="text-slate-900">Full name:</strong> {profile.fullName}</p>
              <p className="text-sm text-slate-600"><strong className="text-slate-900">Email:</strong> {profile.email}</p>
              <p className="text-sm text-slate-600"><strong className="text-slate-900">Role:</strong> {profile.role}</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-950">Status</h2>
              <p className="text-sm text-slate-600"><strong className="text-slate-900">Member since:</strong> {formatDate(profile.createdAt)}</p>
              <p className="text-sm text-slate-600"><strong className="text-slate-900">Access:</strong> Protected account</p>
              <p className="text-sm text-slate-600"><strong className="text-slate-900">State:</strong> Active user</p>
            </div>
          </div>
        </>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          to="/auth"
        >
          Back to account home
        </Link>
        <button
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          onClick={handleLogout}
          type="button"
        >
          Sign out
        </button>
      </div>
    </AuthPageShell>
  );
}

export default ProfilePage;
