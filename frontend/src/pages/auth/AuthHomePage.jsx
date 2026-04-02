import { Link } from "react-router-dom";

function AuthHomePage() {
  return (
    <main className="home-page">
      <section className="simple-panel">
        <p className="section-tag">Member 1 Module</p>
        <h1>Authentication and User Management</h1>
        <p>
          This is the basic starting area for login, register, profile, and
          review-related pages.
        </p>

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
