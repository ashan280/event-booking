import { Link, useNavigate } from "react-router-dom";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import PageIntro from "../../components/PageIntro";
import { clearAuth, getAuth, isAdmin } from "../../lib/auth";

const guestActions = [
  {
    title: "Login",
    description: "Sign in with your email and password.",
    path: "/auth/login"
  },
  {
    title: "Register",
    description: "Create a new account for bookings and tickets.",
    path: "/auth/register"
  },
  {
    title: "Forgot Password",
    description: "Recover access if you forgot your password.",
    path: "/auth/forgot-password"
  },
  {
    title: "Events",
    description: "Browse events, venues, and booking options.",
    path: "/events"
  }
];

const signedInActions = [
  {
    title: "My Bookings",
    description: "Open your booking history, tickets, and payment details.",
    path: "/booking"
  },
  {
    title: "Events",
    description: "Browse events, event details, and reviews.",
    path: "/events"
  },
  {
    title: "Venues",
    description: "Check venues before you book your next event.",
    path: "/venues"
  }
];

function AuthHomePage() {
  const navigate = useNavigate();
  const auth = getAuth();
  const signedIn = Boolean(auth?.token);
  const adminUser = isAdmin(auth);
  const actions = signedIn ? [...signedInActions] : [...guestActions];
  const sideCards = [
    {
      tag: "Latest",
      title: "Latest events",
      text: "See new events, dates, venues, and prices.",
      path: "/events",
      label: "View events"
    },
    {
      tag: adminUser ? "Admin" : "Venues",
      title: adminUser ? "Admin dashboard" : "Venue pages",
      text: adminUser
        ? "Manage events and check booking reports here."
        : "Open venue pages before you choose your next event.",
      path: adminUser ? "/admin" : "/venues",
      label: adminUser ? "Open admin" : "View venues"
    },
    {
      tag: "Reviews",
      title: "Event reviews",
      text: "Read event feedback or post your own review from an event page.",
      path: "/events",
      label: "Open events"
    }
  ];

  if (adminUser) {
    actions.push({
      title: "Admin Dashboard",
      description: "Manage events and open booking reports.",
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
          title="Account and access"
          description="Use this page to sign in, check your account details, open bookings, and reach admin tools when available."
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
              <strong>{signedIn ? "Account ready" : "Login and register"}</strong>
            </article>
            <article className="account-stat-card">
              <p>Shortcuts</p>
              <strong>{actions.length} pages</strong>
            </article>
            <article className="account-stat-card">
              <p>Status</p>
              <strong>{signedIn ? "Signed in" : "Guest"}</strong>
            </article>
          </div>
        </PageIntro>

        <section className="account-home-grid">
          <section className="simple-panel account-pages-panel">
            <div className="section-head">
              <p className="section-tag">Pages</p>
              <h2>{signedIn ? "Quick links" : "Account pages"}</h2>
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
                      <strong>Signed in</strong>
                    </article>
                    <article className="detail-card detail-card-wide">
                      <span className="profile-summary-label">Bookings</span>
                      <strong>{signedIn ? "Booking pages ready" : "Sign in first"}</strong>
                    </article>
                  </div>
                  <div className="auth-link-list">
                    <Link className="primary-link" to="/booking">
                      My bookings
                    </Link>
                    {isAdmin(auth) ? (
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
                  <p className="account-note-text">
                    No user is signed in right now. Login and register are open. Bookings and event reviews need sign in.
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

            
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthHomePage;
