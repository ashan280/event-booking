import { Link } from "react-router-dom";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import PageIntro from "../../components/PageIntro";
import { getAuth, isAdmin } from "../../lib/auth";

const authActions = [
  {
    title: "Login",
    description: "Sign in with email and password.",
    path: "/auth/login"
  },
  {
    title: "Register",
    description: "Create a new account.",
    path: "/auth/register"
  },
  {
    title: "Forgot Password",
    description: "Recover access to your account.",
    path: "/auth/forgot-password"
  },
  {
    title: "Reset Password",
    description: "Set a new password.",
    path: "/auth/reset-password"
  },
  {
    title: "Profile",
    description: "View your account details.",
    path: "/auth/profile"
  },
  {
    title: "Reviews",
    description: "Add and read reviews.",
    path: "/auth/reviews"
  }
];

function AuthHomePage() {
  const auth = getAuth();
  const actions = [...authActions];
  const highlights = [
    "Sign in to book events and save your booking details.",
    "Open your profile to check your account details.",
    "Use booking history to see your tickets and past bookings.",
    "Use password reset if you cannot sign in.",
    "Check events and venues before booking."
  ];

  if (isAdmin(auth)) {
    highlights.push("Admins can manage events and check booking reports.");
  }

  if (auth?.token) {
    actions.push({
      title: "My Bookings",
      description: "Check the events you booked.",
      path: "/booking"
    });
  }

  if (isAdmin(auth)) {
    actions.push({
      title: "Admin Dashboard",
      description: "Check admin pages.",
      path: "/admin"
    });
  }

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <PageIntro
          eyebrow="Account"
          title="Your account page."
          description="Sign in, check your profile, open your bookings, and go to admin pages if you are an admin."
          actions={(
            <>
              <Link className="ghost-link" to="/">
                Back to home
              </Link>
              {auth?.token ? (
                <Link className="ghost-link" to="/booking">
                  My bookings
                </Link>
              ) : null}
              {isAdmin(auth) ? (
                <Link className="ghost-link" to="/admin">
                  Admin dashboard
                </Link>
              ) : null}
            </>
          )}
        >
          <div className="account-stat-grid">
            <article className="account-stat-card">
              <p>Access</p>
              <strong>Login and register</strong>
            </article>
            <article className="account-stat-card">
              <p>Pages</p>
              <strong>{actions.length} screens</strong>
            </article>
            <article className="account-stat-card">
              <p>Status</p>
              <strong>{auth?.token ? "Signed in" : "Open"}</strong>
            </article>
          </div>
        </PageIntro>

        <section className="account-home-grid">
          <section className="simple-panel">
            <div className="section-head">
              <p className="section-tag">Pages</p>
              <h2>Account pages</h2>
            </div>

            <div className="account-action-grid">
              {actions.map((action) => (
                <Link className="account-action-card" key={action.path} to={action.path}>
                  <div className="account-action-head">
                    <h3>{action.title}</h3>
                    <span>Open</span>
                  </div>
                  <p>{action.description}</p>
                  <strong>Go to page</strong>
                </Link>
              ))}
            </div>
          </section>

          <div className="account-home-side">
            <section className="simple-panel">
              <div className="section-head">
                <p className="section-tag">User</p>
                <h2>{auth?.fullName ? auth.fullName : "Welcome"}</h2>
              </div>

              {auth?.fullName ? (
                <div className="account-note-stack">
                  <p className="account-note-text">{auth.email}</p>
                  <div className="detail-box">
                    <p><strong>Role:</strong> {auth.role}</p>
                    <p><strong>Account:</strong> Logged in</p>
                  </div>
                  <Link className="primary-link" to="/auth/profile">
                    Profile
                  </Link>
                </div>
              ) : (
                <div className="account-note-stack">
                  <p className="account-note-text">
                    No user is signed in right now. Login and register are open. Profile and reviews need sign in.
                  </p>
                  <div className="auth-link-list">
                    <Link className="ghost-link" to="/auth/login">
                      Sign in
                    </Link>
                    <Link className="ghost-link" to="/auth/register">
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </section>

            <section className="simple-panel">
              <div className="section-head">
                <p className="section-tag">Useful</p>
                <h2>Account info</h2>
              </div>

              <div className="account-step-list">
                {highlights.map((item, index) => (
                  <div className="account-step-item" key={item}>
                    <span>{index + 1}</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthHomePage;
