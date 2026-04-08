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
  const paymentState = searchParams.get("payment");

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

  function renderTicketBanner() {
    if (!booking) {
      return null;
    }

    if (paymentState === "success" || booking.paymentStatus === "PAID") {
      return (
        <div className="ticket-status-banner ticket-status-success">
          <span className="ticket-status-pill">Paid</span>
          <div>
            <strong>Payment successful</strong>
            <p>Your booking is confirmed and the ticket is ready.</p>
          </div>
        </div>
      );
    }

    if (paymentState === "free" || booking.paymentStatus === "FREE") {
      return (
        <div className="ticket-status-banner ticket-status-info">
          <span className="ticket-status-pill">Free</span>
          <div>
            <strong>Free booking confirmed</strong>
            <p>No payment was needed for this event. Your ticket is ready.</p>
          </div>
        </div>
      );
    }

    if (booking.paymentStatus === "PENDING") {
      return (
        <div className="ticket-status-banner ticket-status-warning">
          <span className="ticket-status-pill">Pending</span>
          <div>
            <strong>Booking saved</strong>
            <p>Your seats are confirmed. Complete the payment with the selected method.</p>
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <PageIntro
          eyebrow="Ticket"
          title="Your event ticket"
          description="Use this page to check your ticket code, seats, and payment details."
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
          <section className="ticket-screen-layout">
            <div className="ticket-page-wrap">
              <article className="simple-panel ticket-card">
                {renderTicketBanner()}

                <div className="ticket-top">
                  <div className="ticket-brand">
                    <p className="section-tag">Event ticket</p>
                    <h2>{booking.eventTitle}</h2>
                    <p>
                      {booking.eventDate} at {booking.eventTime}
                    </p>
                  </div>
                  <div className="ticket-code-box">
                    <span>Ticket code</span>
                    <strong>{booking.ticketCode}</strong>
                  </div>
                </div>

                <div className="ticket-body ticket-body-simple">
                  <div className="ticket-info ticket-info-full">
                    <div className="ticket-detail-grid">
                      <article className="ticket-detail-card">
                        <span>Venue</span>
                        <strong>{booking.venue}</strong>
                      </article>
                      <article className="ticket-detail-card">
                        <span>City</span>
                        <strong>{booking.city}</strong>
                      </article>
                      <article className="ticket-detail-card">
                        <span>Booking status</span>
                        <strong>{booking.bookingStatus}</strong>
                      </article>
                      <article className="ticket-detail-card">
                        <span>Payment</span>
                        <strong>{booking.paymentStatus}</strong>
                      </article>
                      <article className="ticket-detail-card">
                        <span>Method</span>
                        <strong>{booking.paymentMethod}</strong>
                      </article>
                      <article className="ticket-detail-card print-hide">
                        <span>Booked at</span>
                        <strong>{formatDateTime(booking.createdAt)}</strong>
                      </article>
                    </div>

                    <div className="ticket-seat-row">
                      <div>
                        <span>Seat numbers</span>
                        <strong>{booking.seatLabels.join(", ")}</strong>
                      </div>
                      <div className="ticket-seat-count">
                        <span>Seats</span>
                        <strong>{booking.seatCount}</strong>
                      </div>
                    </div>

                    <div className="ticket-footer-row">
                      <article className="ticket-footer-item">
                        <span>Date</span>
                        <strong>{booking.eventDate}</strong>
                      </article>
                      <article className="ticket-footer-item">
                        <span>Time</span>
                        <strong>{booking.eventTime}</strong>
                      </article>
                      <article className="ticket-footer-item ticket-footer-total">
                        <span>Total paid</span>
                        <strong>{formatAmount(booking.totalAmount)}</strong>
                      </article>
                    </div>

                    <div className="ticket-print-meta print-only">
                      <article className="ticket-print-item">
                        <span>Issued at</span>
                        <strong>{formatDateTime(booking.createdAt)}</strong>
                      </article>
                      <article className="ticket-print-item">
                        <span>Entry note</span>
                        <strong>Show this ticket code at the venue entrance.</strong>
                      </article>
                    </div>
                  </div>
                </div>

                <p className="ticket-note">
                  Print this ticket or open it again from your bookings page.
                </p>
              </article>
            </div>

            <aside className="ticket-side-panel print-hide">
              <article className="simple-panel compact-panel">
                <p className="section-tag">Booking details</p>
                <h2 className="panel-title">Ticket summary</h2>
                <div className="ticket-side-grid">
                  <article className="ticket-side-card">
                    <span>Status</span>
                    <strong>{booking.bookingStatus}</strong>
                  </article>
                  <article className="ticket-side-card">
                    <span>Payment</span>
                    <strong>{booking.paymentStatus}</strong>
                  </article>
                  <article className="ticket-side-card">
                    <span>Method</span>
                    <strong>{booking.paymentMethod}</strong>
                  </article>
                  <article className="ticket-side-card">
                    <span>Total</span>
                    <strong>{formatAmount(booking.totalAmount)}</strong>
                  </article>
                </div>
              </article>

              <article className="simple-panel compact-panel">
                <p className="section-tag">Actions</p>
                <h2 className="panel-title">Use this ticket</h2>
                <p className="ticket-side-text">
                  Open this page again from your bookings list or print it before the event.
                </p>
                <div className="ticket-side-actions">
                  <button className="primary-link" type="button" onClick={handlePrint}>
                    Print ticket
                  </button>
                  <Link className="ghost-link" to="/booking">
                    My bookings
                  </Link>
                  <Link className="ghost-link" to={`/events/${booking.eventId}`}>
                    Event details
                  </Link>
                </div>
              </article>
            </aside>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default TicketPage;
