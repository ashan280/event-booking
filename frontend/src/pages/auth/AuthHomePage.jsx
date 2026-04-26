import { Link, useNavigate } from "react-router-dom";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import PageIntro from "../../components/PageIntro";
import { clearAuth, getAuth, isAdmin } from "../../lib/auth";

const guestActions = [
  {
    title: "Sign in",
    description: "Sign in to open your account and use booking features.",
    path: "/auth/login"
  },
  {
    title: "Create account",
    description: "Create a new account for bookings and tickets.",
    path: "/auth/register"
  },
  {
    title: "Forgot password",
    description: "Recover access quickly if you cannot sign in right now.",
    path: "/auth/forgot-password"
  },
  {
    title: "Browse events",
    description: "Check events first before creating an account.",
    path: "/events"
  }
];

const signedInActions = [
  {
    title: "My bookings",
    description: "Open your booking history, ticket pages, and payment details.",
    path: "/booking"
  },
  {
    title: "Events",
    description: "Check events, details, and reviews.",
    path: "/events"
  },
  {
    title: "Venues",
    description: "Check venue pages before booking your next event.",
    path: "/venues"
  }
];

function AuthHomePage() {
  const navigate = useNavigate();
  const auth = getAuth();
  const signedIn = Boolean(auth?.token);
  const adminUser = isAdmin(auth);
  const actions = signedIn ? [...signedInActions] : [...guestActions];

  if (adminUser) {
    actions.push({
      title: "Admin dashboard",
      description: "Open the admin page for events and reports.",
      path: "/admin"
    });
  }

  function handleLogout() {
    clearAuth();
    navigate("/auth/login");
  }

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <PageIntro
          eyebrow="Account"
          title={signedIn ? "Your account" : "Account page"}
          description={signedIn
            ? "Check your account details, bookings, and useful pages."
            : "Sign in, create an account, or browse the main pages first."}
          actions={(
            <>
              <Link className="ghost-link" to="/">
                Back home
              </Link>
              {signedIn ? (
                <Link className="ghost-link" to="/booking">
                  My bookings
                </Link>
              ) : null}
              {adminUser ? (
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
              <strong>{signedIn ? "Ready to go" : "Guest mode"}</strong>
            </article>
            <article className="account-stat-card">
              <p>Shortcuts</p>
              <strong>{actions.length} pages</strong>
            </article>
            <article className="account-stat-card">
              <p>Status</p>
              <strong>{signedIn ? "Signed in" : "Not signed in"}</strong>
            </article>
          </div>
        </PageIntro>

        <section className="account-home-grid">
          <section className="simple-panel account-pages-panel">
            <div className="section-head">
              <p className="section-tag">Shortcuts</p>
              <h2>{signedIn ? "Quick pages" : "Pages to start with"}</h2>
            </div>

            <div className="account-action-grid">
              {actions.map((action) => (
                <Link className="account-action-card" key={action.path} to={action.path}>
                  <div className="account-action-head">
                    <h3>{action.title}</h3>
                    <span>Go</span>
                  </div>
                  <p>{action.description}</p>
                  <strong>Continue</strong>
                </Link>
              ))}
            </div>
          </section>

          <section className="simple-panel account-user-panel">
            <div className="section-head">
              <p className="section-tag">User</p>
              <h2>{signedIn ? "Account overview" : "Guest access"}</h2>
            </div>

            {auth?.fullName ? (
              <div className="account-note-stack">
                <div className="account-user-hero">
                  <div>
                    <h3>{auth.fullName}</h3>
                    <p className="account-note-text">{auth.email}</p>
                  </div>
                  <span className="account-badge">{auth.role}</span>
                </div>

                <div className="account-message-box">
                  <strong>{adminUser ? "You are signed in as admin." : "Your account is ready."}</strong>
                  <p>
                    {adminUser
                      ? "You can manage events and open reports from here."
                      : "Your bookings, tickets, and reviews are available here."}
                  </p>
                </div>

                <div className="detail-grid">
                  <article className="detail-card">
                    <span className="profile-summary-label">Name</span>
                    <strong>{auth.fullName}</strong>
                  </article>
                  <article className="detail-card detail-card-wide">
                    <span className="profile-summary-label">Email</span>
                    <strong>{auth.email}</strong>
                  </article>
                  <article className="detail-card">
                    <span className="profile-summary-label">Role</span>
                    <strong>{auth.role}</strong>
                  </article>
                  <article className="detail-card">
                    <span className="profile-summary-label">Status</span>
                    <strong>Active session</strong>
                  </article>
                </div>

                <div className="auth-link-list">
                  <Link className="primary-link" to="/booking">
                    My bookings
                  </Link>
                  {adminUser ? (
                    <Link className="ghost-link" to="/admin">
                      Admin dashboard
                    </Link>
                  ) : null}
                  <Link className="ghost-link" to="/events">
                    Events
                  </Link>
                  <button className="ghost-link" onClick={handleLogout} type="button">
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="account-note-stack">
                <div className="account-message-box">
                  <strong>You are browsing as a guest.</strong>
                  <p>Sign in or create an account to book seats, save tickets, and post reviews.</p>
                </div>

                <div className="detail-grid">
                  <article className="detail-card">
                    <span className="profile-summary-label">Bookings</span>
                    <strong>Sign in required</strong>
                  </article>
                  <article className="detail-card">
                    <span className="profile-summary-label">Tickets</span>
                    <strong>Saved after login</strong>
                  </article>
                  <article className="detail-card detail-card-wide">
                    <span className="profile-summary-label">Events</span>
                    <strong>You can still browse events and venues before creating an account.</strong>
                  </article>
                </div>

                <div className="auth-link-list">
                  <Link className="primary-link" to="/auth/login">
                    Sign in
                  </Link>
                  <Link className="ghost-link" to="/auth/register">
                    Register
                  </Link>
                  <Link className="ghost-link" to="/events">
                    Browse events
                  </Link>
                </div>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

export default AuthHomePage;
