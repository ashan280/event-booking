import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import { apiRequest } from "../../lib/api";

function formatDateTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function formatAmount(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2
  }).format(value || 0);
}

function BookingHistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookings() {
      setIsLoading(true);
      setError("");

      try {
        const data = await apiRequest("/api/bookings", { auth: true });
        setBookings(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadBookings();
  }, []);

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <section className="simple-panel">
          <p className="section-tag">My bookings</p>
          <h1>Your bookings.</h1>
          <p>Check the events you booked, the number of seats, and the booking date.</p>

          <div className="auth-link-list">
            <Link className="ghost-link" to="/events">
              Browse events
            </Link>
            <Link className="ghost-link" to="/auth/profile">
              Open profile
            </Link>
          </div>
        </section>

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading booking history...</p>
          </section>
        ) : null}

        {error ? <p className="error-text">{error}</p> : null}

        {!isLoading && !bookings.length ? (
          <section className="simple-panel">
            <p>You have no bookings yet. Open the event list and book your first event.</p>
          </section>
        ) : null}

        {!isLoading && bookings.length ? (
          <section className="booking-history-grid">
            {bookings.map((booking) => (
              <article className="simple-panel booking-history-card" key={booking.id}>
                <p className="section-tag">{booking.bookingStatus}</p>
                <h2 className="panel-title">{booking.eventTitle}</h2>
                <div className="booking-info-grid">
                  <p><strong>Date:</strong> {booking.eventDate}</p>
                  <p><strong>Time:</strong> {booking.eventTime}</p>
                  <p><strong>Venue:</strong> {booking.venue}</p>
                  <p><strong>City:</strong> {booking.city}</p>
                  <p><strong>Seats:</strong> {booking.seatCount}</p>
                  <p><strong>Total:</strong> {formatAmount(booking.totalAmount)}</p>
                  <p><strong>Booked at:</strong> {formatDateTime(booking.createdAt)}</p>
                </div>
                <Link className="ghost-link" to={`/events/${booking.eventId}`}>
                  View event
                </Link>
              </article>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default BookingHistoryPage;
