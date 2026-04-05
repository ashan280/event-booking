import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import { apiRequest } from "../../lib/api";
import { getAuth, isAdmin } from "../../lib/auth";

function formatAmount(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2
  }).format(value || 0);
}

function AdminDashboardPage() {
  const auth = getAuth();
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdmin(auth)) {
      setIsLoading(false);
      return;
    }

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const data = await apiRequest("/api/admin/dashboard", { auth: true });
        setDashboard(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [auth]);

  if (!isAdmin(auth)) {
    return (
      <main className="home-page">
        <div className="page-shell">
          <PublicSiteHeader />

          <section className="simple-panel">
            <p className="section-tag">Admin</p>
            <h1>Admin dashboard only.</h1>
            <p>You need an admin account to open this page.</p>
            <div className="auth-link-list">
              <Link className="ghost-link" to="/auth/login">
                Go to login
              </Link>
              <Link className="ghost-link" to="/">
                Back to home
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <section className="simple-panel">
          <p className="section-tag">Admin dashboard</p>
          <h1>Manage events and bookings.</h1>
          <p>Add events, update venue details in the forms, and check recent bookings from one place.</p>

          <div className="auth-link-list">
            <Link className="ghost-link" to="/events/create">
              Add event
            </Link>
            <Link className="ghost-link" to="/events">
              Manage events
            </Link>
            <Link className="ghost-link" to="/venues">
              View venues
            </Link>
          </div>
        </section>

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading dashboard...</p>
          </section>
        ) : null}

        {error ? <p className="error-text">{error}</p> : null}

        {dashboard ? (
          <>
            <section className="admin-summary-grid">
              <article className="simple-panel compact-panel">
                <p className="section-tag">Users</p>
                <h2 className="panel-title">{dashboard.totalUsers}</h2>
              </article>
              <article className="simple-panel compact-panel">
                <p className="section-tag">Events</p>
                <h2 className="panel-title">{dashboard.totalEvents}</h2>
              </article>
              <article className="simple-panel compact-panel">
                <p className="section-tag">Bookings</p>
                <h2 className="panel-title">{dashboard.totalBookings}</h2>
              </article>
              <article className="simple-panel compact-panel">
                <p className="section-tag">Venues</p>
                <h2 className="panel-title">{dashboard.totalVenues}</h2>
              </article>
            </section>

            <section className="simple-panel">
              <p className="section-tag">Recent bookings</p>
              <h2 className="panel-title">Latest bookings</h2>

              {!dashboard.recentBookings.length ? (
                <p>No bookings yet.</p>
              ) : (
                <div className="booking-history-grid">
                  {dashboard.recentBookings.map((booking) => (
                    <article className="booking-history-card admin-booking-card" key={booking.id}>
                      <h3>{booking.eventTitle}</h3>
                      <p>{booking.city} | {booking.venue}</p>
                      <p>Seats: {booking.seatCount}</p>
                      <p>Total: {formatAmount(booking.totalAmount)}</p>
                      <Link className="ghost-link" to={`/events/${booking.eventId}`}>
                        Open event
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}

export default AdminDashboardPage;
