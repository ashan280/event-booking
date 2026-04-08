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

function formatCardAmount(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0);
}

function formatShortDateTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-LK", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

function getSeatPreview(seatLabels) {
  if (!seatLabels?.length) {
    return "-";
  }

  if (seatLabels.length <= 4) {
    return seatLabels.join(", ");
  }

  return `${seatLabels.slice(0, 4).join(", ")} +${seatLabels.length - 4} more`;
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
              <Link className="ghost-link" to="/auth">
                My account
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
                    <p>{booking.venue}, {booking.city}</p>
                  </div>
                </div>

                <div className="booking-history-summary">
                  <div className="booking-history-detail-grid">
                    <article className="booking-history-detail-card">
                      <span>Date</span>
                      <strong>{booking.eventDate}</strong>
                    </article>
                    <article className="booking-history-detail-card">
                      <span>Time</span>
                      <strong>{booking.eventTime}</strong>
                    </article>
                    <article className="booking-history-detail-card">
                      <span>Seats</span>
                      <strong>{booking.seatCount}</strong>
                    </article>
                    <article className="booking-history-detail-card">
                      <span>Total</span>
                      <strong>{formatCardAmount(booking.totalAmount)}</strong>
                    </article>
                    <article className="booking-history-detail-card">
                      <span>Payment</span>
                      <strong>{booking.paymentStatus}</strong>
                    </article>
                    <article className="booking-history-detail-card">
                      <span>Ticket</span>
                      <strong>{booking.ticketCode}</strong>
                    </article>
                  </div>

                  <div className="booking-history-note-box">
                    <p><strong>Seats:</strong> {getSeatPreview(booking.seatLabels)}</p>
                    <p><strong>Method:</strong> {booking.paymentMethod}</p>
                    <p><strong>Booked:</strong> {formatShortDateTime(booking.createdAt)}</p>
                  </div>
                </div>

                <div className="booking-history-actions">
                  <Link className="ghost-link" to={`/events/${booking.eventId}`}>
                    View event
                  </Link>
                  <Link className="ghost-link" to={`/booking/tickets/${booking.id}`}>
                    View ticket
                  </Link>
                  {booking.bookingStatus !== "CANCELLED" ? (
                    <button
                      className="ghost-link delete-link booking-history-action-full"
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
