import { Link } from "react-router-dom";
import { getAuth } from "../../lib/auth";

function AuthHomePage() {
  const auth = getAuth();

  return (
    <main className="home-page">
      <section className="simple-panel">
        <p className="section-tag">Member 1 Module</p>
        <h1>Authentication and User Management</h1>
        <p>
          This area has login, register, and profile pages for the auth module.
        </p>

        {auth?.fullName ? (
          <p className="success-text">Current user: {auth.fullName}</p>
        ) : (
          <p className="helper-text">No user is logged in now.</p>
        )}

        <div className="auth-link-list">
          <Link className="primary-link" to="/auth/login">
            Go to login
          </Link>
          <Link className="primary-link secondary-link" to="/auth/register">
            Go to register
          </Link>
          <Link className="primary-link secondary-link" to="/auth/profile">
            Go to profile
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AuthHomePage;
