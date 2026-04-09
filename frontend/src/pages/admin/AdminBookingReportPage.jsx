import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageIntro from "../../components/PageIntro";
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

          <PageIntro
            eyebrow="Admin"
            title="Admin only."
            description="You need an admin account to open this page."
            actions={(
              <>
                <Link className="ghost-link" to="/auth/login">
                  Go to login
                </Link>
                <Link className="ghost-link" to="/">
                  Back to home
                </Link>
              </>
            )}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <PageIntro
          eyebrow="Booking report"
          title="Booking report."
          description="Check bookings, cancelled orders, seats booked, and ticket details."
          actions={(
            <>
              <Link className="ghost-link" to="/admin">
                Back to dashboard
              </Link>
              <Link className="ghost-link" to="/events">
                Events
              </Link>
            </>
          )}
        />

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading booking report...</p>
          </section>
        ) : null}

        {error ? <p className="error-text">{error}</p> : null}

        {report ? (
          <>
            <section className="admin-summary-grid">
              <article className="simple-panel compact-panel admin-stat-card">
                <p className="section-tag">Total bookings</p>
                <h2 className="panel-title">{report.totalBookings}</h2>
              </article>
              <article className="simple-panel compact-panel admin-stat-card">
                <p className="section-tag">Confirmed</p>
                <h2 className="panel-title">{report.confirmedBookings}</h2>
              </article>
              <article className="simple-panel compact-panel admin-stat-card">
                <p className="section-tag">Cancelled</p>
                <h2 className="panel-title">{report.cancelledBookings}</h2>
              </article>
              <article className="simple-panel compact-panel admin-stat-card">
                <p className="section-tag">Seats booked</p>
                <h2 className="panel-title">{report.totalSeatsBooked}</h2>
              </article>
              <article className="simple-panel compact-panel admin-stat-card">
                <p className="section-tag">Revenue</p>
                <h2 className="panel-title">{formatAmount(report.totalRevenue)}</h2>
              </article>
            </section>

            <section className="simple-panel">
              <p className="section-tag">By city</p>
              <h2 className="panel-title">Bookings by location</h2>

              {!report.citySummaries.length ? (
                <p>No city data yet.</p>
              ) : (
                <div className="admin-city-grid">
                  {report.citySummaries.map((item) => (
                    <article className="admin-city-card" key={item.city}>
                      <p className="section-tag">City</p>
                      <h3>{item.city}</h3>
                      <div className="booking-detail-grid admin-city-detail-grid">
                        <article className="booking-detail-card">
                          <span className="booking-detail-label">Bookings</span>
                          <strong className="booking-detail-value">{item.bookingCount}</strong>
                        </article>
                        <article className="booking-detail-card">
                          <span className="booking-detail-label">Seats</span>
                          <strong className="booking-detail-value">{item.seatsBooked}</strong>
                        </article>
                        <article className="booking-detail-card booking-detail-card-wide">
                          <span className="booking-detail-label">Revenue</span>
                          <strong className="booking-detail-value">{formatAmount(item.revenue)}</strong>
                        </article>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="simple-panel">
              <p className="section-tag">Recent bookings</p>
              <h2 className="panel-title">Recent bookings</h2>

              {!report.recentBookings.length ? (
                <p>No bookings yet.</p>
              ) : (
                <div className="booking-history-grid">
                  {report.recentBookings.map((booking) => (
                    <article className="booking-history-card admin-booking-card" key={booking.id}>
                      <div className="booking-history-hero">
                        <img
                          className="booking-history-photo"
                          src={booking.eventImageUrl || "/images/concert.png"}
                          alt={booking.eventTitle}
                        />
                        <div className="booking-history-copy">
                          <p className="section-tag">{booking.bookingStatus}</p>
                          <h3>{booking.eventTitle}</h3>
                          <p>{booking.city} | {booking.venue}</p>
                        </div>
                      </div>
                      <div className="booking-detail-grid admin-booking-detail-grid">
                        <article className="booking-detail-card booking-detail-card-wide">
                          <span className="booking-detail-label">Seats</span>
                          <strong className="booking-detail-value">{booking.seatLabels.join(", ")}</strong>
                        </article>
                        <article className="booking-detail-card">
                          <span className="booking-detail-label">Payment</span>
                          <strong className="booking-detail-value">{booking.paymentStatus}</strong>
                        </article>
                        <article className="booking-detail-card">
                          <span className="booking-detail-label">Total</span>
                          <strong className="booking-detail-value">{formatAmount(booking.totalAmount)}</strong>
                        </article>
                      </div>
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
