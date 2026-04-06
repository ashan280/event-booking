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

function AdminBookingReportPage() {
  const auth = getAuth();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdmin(auth)) {
      setIsLoading(false);
      return;
    }

    async function loadReport() {
      setIsLoading(true);
      setError("");

      try {
        const data = await apiRequest("/api/admin/bookings/report", { auth: true });
        setReport(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadReport();
  }, [auth]);

  if (!isAdmin(auth)) {
    return (
      <main className="home-page">
        <div className="page-shell">
          <PublicSiteHeader />

          <section className="simple-panel">
            <p className="section-tag">Admin</p>
            <h1>Admin report only.</h1>
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
          <p className="section-tag">Booking report</p>
          <h1>Check booking numbers and revenue.</h1>
          <p>Use this page to see bookings, cancelled orders, seats booked, and recent ticket activity.</p>

          <div className="auth-link-list">
            <Link className="ghost-link" to="/admin">
              Back to dashboard
            </Link>
            <Link className="ghost-link" to="/events">
              Open events
            </Link>
          </div>
        </section>

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading booking report...</p>
          </section>
        ) : null}

        {error ? <p className="error-text">{error}</p> : null}

        {report ? (
          <>
            <section className="admin-summary-grid">
              <article className="simple-panel compact-panel">
                <p className="section-tag">Total bookings</p>
                <h2 className="panel-title">{report.totalBookings}</h2>
              </article>
              <article className="simple-panel compact-panel">
                <p className="section-tag">Confirmed</p>
                <h2 className="panel-title">{report.confirmedBookings}</h2>
              </article>
              <article className="simple-panel compact-panel">
                <p className="section-tag">Cancelled</p>
                <h2 className="panel-title">{report.cancelledBookings}</h2>
              </article>
              <article className="simple-panel compact-panel">
                <p className="section-tag">Seats booked</p>
                <h2 className="panel-title">{report.totalSeatsBooked}</h2>
              </article>
              <article className="simple-panel compact-panel">
                <p className="section-tag">Revenue</p>
                <h2 className="panel-title">{formatAmount(report.totalRevenue)}</h2>
              </article>
            </section>

            <section className="simple-panel">
              <p className="section-tag">Recent bookings</p>
              <h2 className="panel-title">Latest activity</h2>

              {!report.recentBookings.length ? (
                <p>No bookings yet.</p>
              ) : (
                <div className="booking-history-grid">
                  {report.recentBookings.map((booking) => (
                    <article className="booking-history-card admin-booking-card" key={booking.id}>
                      <p className="section-tag">{booking.bookingStatus}</p>
                      <h3>{booking.eventTitle}</h3>
                      <p>{booking.city} | {booking.venue}</p>
                      <p>Seats: {booking.seatLabels.join(", ")}</p>
                      <p>Payment: {booking.paymentStatus}</p>
                      <p>Total: {formatAmount(booking.totalAmount)}</p>
                      <div className="auth-link-list">
                        <Link className="ghost-link" to={`/events/${booking.eventId}`}>
                          Open event
                        </Link>
                        <Link className="ghost-link" to={`/booking/tickets/${booking.id}`}>
                          Open ticket
                        </Link>
                      </div>
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

export default AdminBookingReportPage;
