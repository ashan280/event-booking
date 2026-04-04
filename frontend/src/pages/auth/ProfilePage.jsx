import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <main className="home-page">
      <section className="simple-panel">
        <p className="section-tag">Member 1 Module</p>
        <h1>User Profile</h1>
        <p>This page shows more account details for the logged in user.</p>

        {isLoading ? <p className="helper-text">Loading profile...</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {profile ? (
          <>
            <div className="profile-summary-grid">
              <article className="profile-summary-card">
                <span className="profile-summary-label">Name</span>
                <strong>{profile.fullName}</strong>
              </article>
              <article className="profile-summary-card">
                <span className="profile-summary-label">Role</span>
                <strong>{profile.role}</strong>
              </article>
              <article className="profile-summary-card">
                <span className="profile-summary-label">Account ID</span>
                <strong>#{profile.id}</strong>
              </article>
            </div>

            <div className="profile-box">
              <p><strong>Full name:</strong> {profile.fullName}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Role:</strong> {profile.role}</p>
              <p><strong>Account ID:</strong> {profile.id}</p>
              <p><strong>Member since:</strong> {formatDate(profile.createdAt)}</p>
              <p><strong>Status:</strong> Active user</p>
            </div>
          </>
        ) : null}

        <div className="auth-link-list">
          <Link className="primary-link" to="/auth">
            Back to auth home
          </Link>
          <button className="primary-link secondary-link" onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;
