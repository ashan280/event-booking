import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthPageShell from "../../components/AuthPageShell";
import { apiRequest } from "../../lib/api";
import { clearAuth, getAuth, isAdmin } from "../../lib/auth";

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
  const auth = getAuth();
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
      title="Your profile."
      description="Check your details and account status."
      sideTitle="Account"
      sideText="Important account details."
      sideItems={[
        "Check your name, email, and account role.",
        "Open booking history to see your tickets and past bookings.",
        "Use this page before booking or admin work."
      ]}
      sideNote="This page helps you check your account before booking events, viewing tickets, or opening admin pages."
    >
      {isLoading ? (
        <p className="helper-text">Loading your profile...</p>
      ) : null}

      {error ? <p className="error-text">{error}</p> : null}

      {profile ? (
        <>
          <div className="detail-grid">
            <article className="detail-card">
              <p>Name</p>
              <strong>{profile.fullName}</strong>
            </article>
            <article className="detail-card">
              <p>Role</p>
              <strong>{profile.role}</strong>
            </article>
            <article className="detail-card">
              <p>Account ID</p>
              <strong>#{profile.id}</strong>
            </article>
          </div>

          <div className="detail-split-grid">
            <div className="detail-panel">
              <h2 className="panel-title">Account details</h2>
              <div className="booking-info-grid">
                <p><strong>Full name:</strong> {profile.fullName}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Role:</strong> {profile.role}</p>
              </div>
            </div>

            <div className="detail-panel">
              <h2 className="panel-title">Status</h2>
              <div className="booking-info-grid">
                <p><strong>Joined:</strong> {formatDate(profile.createdAt)}</p>
                <p><strong>Access:</strong> Signed in</p>
                <p><strong>Status:</strong> Active</p>
              </div>
            </div>
          </div>
        </>
      ) : null}

      <div className="auth-link-list">
        <Link className="primary-link" to="/auth">
          Back to account home
        </Link>
        <Link className="ghost-link" to="/booking">
          My bookings
        </Link>
        {isAdmin(auth) ? (
          <Link className="ghost-link" to="/admin">
            Admin dashboard
          </Link>
        ) : null}
        <button className="ghost-link" onClick={handleLogout} type="button">
          Sign out
        </button>
      </div>
    </AuthPageShell>
  );
}

export default ProfilePage;
