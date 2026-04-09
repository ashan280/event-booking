import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageIntro from "../../components/PageIntro";
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
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [error, setError] = useState("");

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

  useEffect(() => {
    loadBookings();
  }, []);

  async function handleCancel(bookingId) {
    const confirmed = window.confirm("Do you want to cancel this booking?");

    if (!confirmed) {
      return;
    }

    setActiveBookingId(bookingId);
    setError("");

    try {
      await apiRequest(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        auth: true
      });

      await loadBookings();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setActiveBookingId(null);
    }
  }

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <PageIntro
          eyebrow="My bookings"
          title="Your bookings."
          description="Check the events you booked, the number of seats, and the booking date."
          actions={(
            <>
              <Link className="ghost-link" to="/events">
                Browse events
              </Link>
              <Link className="ghost-link" to="/auth/profile">
                Profile
              </Link>
            </>
          )}
        />

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading booking history...</p>
          </section>
        ) : null}

        {error ? <p className="error-text">{error}</p> : null}

        {!isLoading && !bookings.length ? (
          <section className="simple-panel empty-state-panel">
            <p className="section-tag">No bookings</p>
            <h2>Start with your first event.</h2>
            <p>You have no bookings yet. Open the event list and book your first event.</p>
            <div className="auth-link-list">
              <Link className="primary-link" to="/events">
                Browse events
              </Link>
            </div>
          </section>
        ) : null}

        {!isLoading && bookings.length ? (
          <section className="booking-history-grid">
            {bookings.map((booking) => (
              <article className="simple-panel booking-history-card" key={booking.id}>
                <div className="booking-history-hero">
                  <img
                    className="booking-history-photo"
                    src={booking.eventImageUrl || "/images/concert.png"}
                    alt={booking.eventTitle}
                  />
                  <div className="booking-history-copy">
                    <p className="section-tag">{booking.bookingStatus}</p>
                    <h2 className="panel-title">{booking.eventTitle}</h2>
                  </div>
                </div>
                <div className="booking-info-grid">
                  <p><strong>Date:</strong> {booking.eventDate}</p>
                  <p><strong>Time:</strong> {booking.eventTime}</p>
                  <p><strong>Venue:</strong> {booking.venue}</p>
                  <p><strong>City:</strong> {booking.city}</p>
                  <p><strong>Seats:</strong> {booking.seatCount}</p>
                  <p><strong>Seat numbers:</strong> {booking.seatLabels.join(", ")}</p>
                  <p><strong>Total:</strong> {formatAmount(booking.totalAmount)}</p>
                  <p><strong>Payment:</strong> {booking.paymentStatus}</p>
                  <p><strong>Method:</strong> {booking.paymentMethod}</p>
                  <p><strong>Ticket:</strong> {booking.ticketCode}</p>
                  <p><strong>Booked at:</strong> {formatDateTime(booking.createdAt)}</p>
                </div>
                <div className="auth-link-list">
                  <Link className="ghost-link" to={`/events/${booking.eventId}`}>
                    View event
                  </Link>
                  <Link className="ghost-link" to={`/booking/tickets/${booking.id}`}>
                    View ticket
                  </Link>
                  {booking.bookingStatus !== "CANCELLED" ? (
                    <button
                      className="ghost-link delete-link"
                      type="button"
                      onClick={() => handleCancel(booking.id)}
                      disabled={activeBookingId === booking.id}
                    >
                      {activeBookingId === booking.id ? "Cancelling..." : "Cancel booking"}
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default BookingHistoryPage;
