import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageIntro from "../../components/PageIntro";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import { apiRequest } from "../../lib/api";
import { getAuth, isAdmin } from "../../lib/auth";

function formatAmount(value) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2
  }).format(value || 0);
}

function formatDateTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function AdminBookingReportPage() {
  const auth = getAuth();
  const authToken = auth?.token || "";
  const adminAccess = isAdmin(auth);
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  function handlePrint() {
    window.print();
  }

  useEffect(() => {
    if (!adminAccess || !authToken) {
      setIsLoading(false);
      setReport(null);
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
  }, [adminAccess, authToken]);

  if (!adminAccess) {
    return (
      <main className="home-page">
        <div className="page-shell">
          <PublicSiteHeader />

          <PageIntro
            eyebrow="Admin"
            title="Admin access only"
            description="You need an admin account to open booking reports and print admin summaries."
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
          title="Booking report"
          description="Review totals, city performance, and recent bookings in one clear admin report."
          actions={(
            <>
              <button className="ghost-link" type="button" onClick={handlePrint}>
                Print report
              </button>
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
          <div className="admin-report-print">
            <section className="simple-panel compact-panel print-only admin-report-print-head">
              <p className="section-tag">Admin report</p>
              <h1 className="panel-title">Booking report</h1>
              <p>This report shows totals, city details, and recent bookings.</p>
            </section>

            <section className="admin-summary-grid admin-report-section">
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

            <section className="simple-panel admin-report-section">
              <p className="section-tag">By city</p>
              <h2 className="panel-title">Bookings by location</h2>

              {!report.citySummaries.length ? (
                <p>No city data yet.</p>
              ) : (
                <div className="report-table-wrap">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>City</th>
                        <th>Bookings</th>
                        <th>Seats</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.citySummaries.map((item) => (
                        <tr key={item.city}>
                          <td>{item.city}</td>
                          <td>{item.bookingCount}</td>
                          <td>{item.seatsBooked}</td>
                          <td>{formatAmount(item.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="simple-panel admin-report-section">
              <p className="section-tag">Recent bookings</p>
              <h2 className="panel-title">Recent bookings</h2>

              {!report.recentBookings.length ? (
                <p>No bookings yet.</p>
              ) : (
                <div className="report-table-wrap">
                  <table className="report-table report-table-bookings">
                    <thead>
                      <tr>
                        <th>Event</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Seats</th>
                        <th>Payment</th>
                        <th>Total</th>
                        <th>Ticket</th>
                        <th>Booked at</th>
                        <th className="print-hide">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.recentBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>
                            <div className="report-event-cell">
                              <strong>{booking.eventTitle}</strong>
                              <span>{booking.seatLabels.join(", ")}</span>
                            </div>
                          </td>
                          <td>{booking.city} / {booking.venue}</td>
                          <td>{booking.bookingStatus}</td>
                          <td>{booking.seatCount}</td>
                          <td>{booking.paymentStatus}</td>
                          <td>{formatAmount(booking.totalAmount)}</td>
                          <td>{booking.ticketCode}</td>
                          <td>{formatDateTime(booking.createdAt)}</td>
                          <td className="print-hide">
                            <div className="report-table-actions">
                              <Link className="ghost-link" to={`/events/${booking.eventId}`}>
                                Event
                              </Link>
                              <Link className="ghost-link" to={`/booking/tickets/${booking.id}`}>
                                Ticket
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default AdminBookingReportPage;
