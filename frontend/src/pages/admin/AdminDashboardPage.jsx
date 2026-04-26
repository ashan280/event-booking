import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageIntro from "../../components/PageIntro";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import { apiRequest } from "../../lib/api";
import { getAuth, isAdmin } from "../../lib/auth";
import { DEFAULT_EVENT_IMAGE } from "../../lib/constants";

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
    return value || "-";
  }

  return date.toLocaleString("en-IE", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function AdminDashboardPage() {
  const auth = getAuth();
  const authToken = auth?.token || "";
  const adminAccess = isAdmin(auth);
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!adminAccess || !authToken) {
      setIsLoading(false);
      setDashboard(null);
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
  }, [adminAccess, authToken]);

  const recentBookings = dashboard?.recentBookings || [];
  const confirmedCount = recentBookings.filter((booking) => booking.bookingStatus === "CONFIRMED").length;
  const cancelledCount = recentBookings.filter((booking) => booking.bookingStatus === "CANCELLED").length;
  const paidCount = recentBookings.filter((booking) => booking.paymentStatus === "PAID").length;
  const recentRevenue = recentBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
  const recentSeatCount = recentBookings.reduce((sum, booking) => sum + (booking.seatCount || 0), 0);
  const averageBookingValue = recentBookings.length ? recentRevenue / recentBookings.length : 0;
  const occupancySignal = dashboard?.totalEvents
    ? Math.round((dashboard.totalBookings / dashboard.totalEvents) * 100)
    : 0;
  const spotlightBooking = recentBookings[0] || null;
  const dashboardHighlights = [
    {
      label: "Recent revenue",
      value: formatAmount(recentRevenue),
      note: "Based on the recent bookings shown below"
    },
    {
      label: "Average booking value",
      value: formatAmount(averageBookingValue),
      note: "Average value of recent bookings"
    },
    {
      label: "Bookings per event",
      value: dashboard?.totalEvents ? `${(dashboard.totalBookings / dashboard.totalEvents).toFixed(1)} avg` : "0 avg",
      note: "Average bookings across all events"
    }
  ];

  if (!adminAccess) {
    return (
      <main className="home-page">
        <div className="page-shell">
          <PublicSiteHeader />

          <PageIntro
            eyebrow="Admin"
            title="Admin access only"
            description="You need an admin account to open the dashboard and manage events."
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
          eyebrow="Admin dashboard"
          title="Admin dashboard"
          description="Check platform activity, manage events, and view recent bookings."
          actions={(
            <>
              <Link className="ghost-link" to="/events/create">
                Add event
              </Link>
              <Link className="ghost-link" to="/events">
                Manage events
              </Link>
              <Link className="ghost-link" to="/venues">
                View venues
              </Link>
              <Link className="ghost-link" to="/admin/reports">
                Booking report
              </Link>
            </>
          )}
        />

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading dashboard...</p>
          </section>
        ) : null}

        {error ? <p className="error-text">{error}</p> : null}

        {dashboard ? (
          <>
            <section className="admin-command-grid">
              <article className="simple-panel admin-command-hero">
                <div className="admin-command-copy">
                  <p className="section-tag">Live snapshot</p>
                  <h2 className="panel-title">Dashboard summary</h2>
                  <p>View totals, recent booking details, and useful admin shortcuts.</p>
                </div>

                <div className="admin-highlight-grid">
                  {dashboardHighlights.map((item) => (
                    <article className="admin-highlight-card" key={item.label}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                      <p>{item.note}</p>
                    </article>
                  ))}
                </div>
              </article>

              <aside className="simple-panel admin-health-panel">
                <p className="section-tag">Health check</p>
                <h2 className="panel-title">Current status</h2>
                <div className="admin-health-list">
                  <article>
                    <span>Confirmed bookings</span>
                    <strong>{confirmedCount}</strong>
                  </article>
                  <article>
                    <span>Cancelled bookings</span>
                    <strong>{cancelledCount}</strong>
                  </article>
                  <article>
                    <span>Paid bookings</span>
                    <strong>{paidCount}</strong>
                  </article>
                  <article>
                    <span>Activity intensity</span>
                    <strong>{occupancySignal}%</strong>
                  </article>
                </div>
              </aside>
            </section>

            <section className="admin-summary-grid admin-summary-grid-large">
              <article className="simple-panel compact-panel admin-stat-card">
                <p className="section-tag">Users</p>
                <h2 className="panel-title">{dashboard.totalUsers}</h2>
                <span className="admin-stat-note">Registered accounts on the platform</span>
              </article>
              <article className="simple-panel compact-panel admin-stat-card">
                <p className="section-tag">Events</p>
                <h2 className="panel-title">{dashboard.totalEvents}</h2>
                <span className="admin-stat-note">Active listings available to book</span>
              </article>
              <article className="simple-panel compact-panel admin-stat-card">
                <p className="section-tag">Bookings</p>
                <h2 className="panel-title">{dashboard.totalBookings}</h2>
                <span className="admin-stat-note">Total bookings created so far</span>
              </article>
              <article className="simple-panel compact-panel admin-stat-card">
                <p className="section-tag">Venues</p>
                <h2 className="panel-title">{dashboard.totalVenues}</h2>
                <span className="admin-stat-note">Locations currently supporting events</span>
              </article>
              <article className="simple-panel compact-panel admin-stat-card">
                <p className="section-tag">Recent seats</p>
                <h2 className="panel-title">{recentSeatCount}</h2>
                <span className="admin-stat-note">Seats included in the latest bookings</span>
              </article>
              <article className="simple-panel compact-panel admin-stat-card">
                <p className="section-tag">Recent revenue</p>
                <h2 className="panel-title">{formatAmount(recentRevenue)}</h2>
                <span className="admin-stat-note">Value from the bookings shown below</span>
              </article>
            </section>

            <section className="admin-workbench-grid">
              <section className="simple-panel">
                <div className="admin-section-head">
                  <div>
                    <p className="section-tag">Quick actions</p>
                    <h2 className="panel-title">Quick actions</h2>
                  </div>
                </div>

                <div className="admin-action-grid">
                  <Link className="admin-action-tile" to="/events/create">
                    <span>Create</span>
                    <strong>Add a new event</strong>
                    <p>Publish a new event with image, venue, and pricing details.</p>
                  </Link>
                  <Link className="admin-action-tile" to="/events">
                    <span>Manage</span>
                    <strong>Review all events</strong>
                    <p>Open the event list and update titles, dates, images, or availability.</p>
                  </Link>
                  <Link className="admin-action-tile" to="/venues">
                    <span>Venues</span>
                    <strong>Check venue coverage</strong>
                    <p>See venue pages and check where events are happening.</p>
                  </Link>
                  <Link className="admin-action-tile" to="/admin/reports">
                    <span>Reports</span>
                    <strong>Open booking report</strong>
                    <p>Review booking totals, city data, and recent bookings.</p>
                  </Link>
                </div>
              </section>

              <aside className="simple-panel admin-spotlight-panel">
                <p className="section-tag">Latest activity</p>
                <h2 className="panel-title">Most recent booking</h2>

                {spotlightBooking ? (
                  <div className="admin-spotlight-card">
                    <img
                      className="admin-spotlight-image"
                      src={spotlightBooking.eventImageUrl || DEFAULT_EVENT_IMAGE}
                      alt={spotlightBooking.eventTitle}
                    />
                    <div className="admin-spotlight-copy">
                      <span className="admin-status-pill">{spotlightBooking.bookingStatus}</span>
                      <h3>{spotlightBooking.eventTitle}</h3>
                      <p>{spotlightBooking.city} | {spotlightBooking.venue}</p>
                      <div className="admin-spotlight-meta">
                        <span>{spotlightBooking.seatCount} seats</span>
                        <span>{spotlightBooking.paymentStatus}</span>
                        <span>{formatAmount(spotlightBooking.totalAmount)}</span>
                      </div>
                      <p className="admin-spotlight-time">{formatDateTime(spotlightBooking.createdAt)}</p>
                    </div>
                  </div>
                ) : (
                  <p>No recent booking activity yet.</p>
                )}
              </aside>
            </section>

            <section className="simple-panel">
              <div className="admin-section-head">
                <div>
                  <p className="section-tag">Recent bookings</p>
                  <h2 className="panel-title">Activity feed</h2>
                </div>
                <Link className="ghost-link" to="/admin/reports">
                  Open full report
                </Link>
              </div>

              {!recentBookings.length ? (
                <p>No bookings yet.</p>
              ) : (
                <div className="booking-history-grid">
                  {recentBookings.map((booking) => (
                    <article className="booking-history-card admin-booking-card" key={booking.id}>
                      <div className="booking-history-hero">
                        <img
                          className="booking-history-photo"
                          src={booking.eventImageUrl || DEFAULT_EVENT_IMAGE}
                          alt={booking.eventTitle}
                        />
                        <div className="booking-history-copy">
                          <p className="section-tag">{booking.bookingStatus}</p>
                          <h3>{booking.eventTitle}</h3>
                          <p>{booking.city} | {booking.venue}</p>
                        </div>
                      </div>
                      <div className="booking-history-summary">
                        <div className="booking-history-detail-grid admin-booking-detail-grid">
                          <article className="booking-history-detail-card">
                            <span>Seats</span>
                            <strong>{booking.seatCount}</strong>
                          </article>
                          <article className="booking-history-detail-card">
                            <span>Payment</span>
                            <strong>{booking.paymentStatus}</strong>
                          </article>
                          <article className="booking-history-detail-card">
                            <span>Total</span>
                            <strong>{formatAmount(booking.totalAmount)}</strong>
                          </article>
                          <article className="booking-history-detail-card">
                            <span>Ticket</span>
                            <strong>{booking.ticketCode}</strong>
                          </article>
                        </div>
                        <div className="booking-history-note-box">
                          <p><strong>Booked:</strong> {formatDateTime(booking.createdAt)}</p>
                        </div>
                      </div>
                      <div className="booking-history-actions">
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

export default AdminDashboardPage;
