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
  const sideCards = [
    {
      tag: "Latest",
      title: "Latest events",
      text: "Open the event list and check new dates, venues, and prices.",
      path: "/events",
      label: "View events"
    },
    {
      tag: auth?.token ? "Bookings" : "Account",
      title: auth?.token ? "My bookings" : "Create account",
      text: auth?.token
        ? "Open your bookings to check tickets and old event details."
        : "Create an account if you want to save bookings and tickets.",
      path: auth?.token ? "/booking" : "/auth/register",
      label: auth?.token ? "Open bookings" : "Register"
    },
    {
      tag: isAdmin(auth) ? "Admin" : "Venues",
      title: isAdmin(auth) ? "Admin dashboard" : "Venue pages",
      text: isAdmin(auth)
        ? "Admins can manage events and check booking reports here."
        : "Check venue pages before you choose the next event.",
      path: isAdmin(auth) ? "/admin" : "/venues",
      label: isAdmin(auth) ? "Open admin" : "View venues"
    }
  ];

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
                  <div className="detail-grid">
                    <article className="detail-card">
                      <span className="profile-summary-label">Role</span>
                      <strong>{auth.role}</strong>
                    </article>
                    <article className="detail-card">
                      <span className="profile-summary-label">Status</span>
                      <strong>Signed in</strong>
                    </article>
                    <article className="detail-card">
                      <span className="profile-summary-label">Bookings</span>
                      <strong>{auth?.token ? "Open now" : "Sign in first"}</strong>
                    </article>
                  </div>
                  <div className="auth-link-list">
                    <Link className="primary-link" to="/auth/profile">
                      Profile
                    </Link>
                    <Link className="ghost-link" to="/booking">
                      My bookings
                    </Link>
                  </div>
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
                <h2>Events and bookings</h2>
              </div>

              <div className="auth-side-card-grid">
                {sideCards.map((item) => (
                  <article className="auth-side-card" key={item.title}>
                    <p className="section-tag">{item.tag}</p>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <Link className="ghost-link" to={item.path}>
                      {item.label}
                    </Link>
                  </article>
                ))}
              </div>

              <div className="booking-note-box">
                <strong>Quick tip</strong>
                <p>After login, open your profile or bookings page first before you continue with event booking.</p>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthHomePage;
