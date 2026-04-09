import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import BookingFlowSteps from "../../components/BookingFlowSteps";
import PageIntro from "../../components/PageIntro";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import { apiRequest } from "../../lib/api";

function formatAmount(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
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

function TicketPage() {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const showSuccess = searchParams.get("payment") === "success";

  useEffect(() => {
    async function loadTicket() {
      setIsLoading(true);
      setError("");

      try {
        const data = await apiRequest(`/api/bookings/${bookingId}`, { auth: true });
        setBooking(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadTicket();
  }, [bookingId]);

  function handlePrint() {
    window.print();
  }

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <PageIntro
          eyebrow="Ticket"
          title="Your ticket."
          description="Keep this page for your booking details, ticket code, and payment summary."
          actions={(
            <>
              <Link className="ghost-link" to="/booking">
                My bookings
              </Link>
              {booking ? (
                <Link className="ghost-link" to={`/events/${booking.eventId}`}>
                  Event details
                </Link>
              ) : null}
              <button className="ghost-link" type="button" onClick={handlePrint}>
                Print ticket
              </button>
            </>
          )}
        >
          <BookingFlowSteps current="Ticket" />
        </PageIntro>

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading ticket...</p>
          </section>
        ) : null}

        {error ? <p className="error-text">{error}</p> : null}

        {booking ? (
          <section className="ticket-layout">
            <article className="simple-panel">
              {showSuccess ? (
                <div className="booking-success-banner">
                  <strong>Payment successful</strong>
                  <p>Your booking is confirmed and your ticket is ready.</p>
                </div>
              ) : null}

              <div className="booking-event-hero booking-event-hero-compact">
                <img
                  className="booking-event-photo"
                  src={booking.eventImageUrl || "/images/concert.png"}
                  alt={booking.eventTitle}
                />
                <div className="booking-event-copy">
                  <p className="section-tag">Ticket code</p>
                  <h2 className="panel-title">{booking.ticketCode}</h2>
                  <p className="booking-event-text">{booking.eventTitle}</p>
                </div>
              </div>

              <div className="booking-detail-grid">
                <article className="booking-detail-card">
                  <span className="booking-detail-label">Date</span>
                  <strong className="booking-detail-value">{booking.eventDate}</strong>
                </article>
                <article className="booking-detail-card">
                  <span className="booking-detail-label">Time</span>
                  <strong className="booking-detail-value">{booking.eventTime}</strong>
                </article>
                <article className="booking-detail-card">
                  <span className="booking-detail-label">Venue</span>
                  <strong className="booking-detail-value">{booking.venue}</strong>
                </article>
                <article className="booking-detail-card">
                  <span className="booking-detail-label">City</span>
                  <strong className="booking-detail-value">{booking.city}</strong>
                </article>
                <article className="booking-detail-card">
                  <span className="booking-detail-label">Seats</span>
                  <strong className="booking-detail-value">{booking.seatCount}</strong>
                </article>
                <article className="booking-detail-card booking-detail-card-wide">
                  <span className="booking-detail-label">Seat numbers</span>
                  <strong className="booking-detail-value">{booking.seatLabels.join(", ")}</strong>
                </article>
              </div>
            </article>

            <article className="simple-panel">
              <p className="section-tag">Payment</p>
              <h2 className="panel-title">Booking summary</h2>
              <div className="booking-detail-grid">
                <article className="booking-detail-card">
                  <span className="booking-detail-label">Status</span>
                  <strong className="booking-detail-value">{booking.bookingStatus}</strong>
                </article>
                <article className="booking-detail-card">
                  <span className="booking-detail-label">Payment</span>
                  <strong className="booking-detail-value">{booking.paymentStatus}</strong>
                </article>
                <article className="booking-detail-card">
                  <span className="booking-detail-label">Method</span>
                  <strong className="booking-detail-value">{booking.paymentMethod}</strong>
                </article>
                <article className="booking-detail-card">
                  <span className="booking-detail-label">Booked at</span>
                  <strong className="booking-detail-value">{formatDateTime(booking.createdAt)}</strong>
                </article>
              </div>

              <div className="booking-total-box">
                <p>Total paid</p>
                <strong>{formatAmount(booking.totalAmount)}</strong>
              </div>

              <div className="booking-note-box">
                <strong>Keep this ticket</strong>
                <p>You can reopen it later from the booking history page.</p>
              </div>
            </article>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default TicketPage;
