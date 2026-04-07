import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

function TicketPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
        />

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading ticket...</p>
          </section>
        ) : null}

        {error ? <p className="error-text">{error}</p> : null}

        {booking ? (
          <section className="ticket-layout">
            <article className="simple-panel">
              <p className="section-tag">Ticket code</p>
              <h2 className="panel-title">{booking.ticketCode}</h2>
              <div className="booking-info-grid">
                <p><strong>Event:</strong> {booking.eventTitle}</p>
                <p><strong>Date:</strong> {booking.eventDate}</p>
                <p><strong>Time:</strong> {booking.eventTime}</p>
                <p><strong>Venue:</strong> {booking.venue}</p>
                <p><strong>City:</strong> {booking.city}</p>
                <p><strong>Seats:</strong> {booking.seatCount}</p>
                <p><strong>Seat numbers:</strong> {booking.seatLabels.join(", ")}</p>
              </div>
            </article>

            <article className="simple-panel">
              <p className="section-tag">Payment</p>
              <h2 className="panel-title">Booking summary</h2>
              <div className="booking-info-grid">
                <p><strong>Status:</strong> {booking.bookingStatus}</p>
                <p><strong>Payment:</strong> {booking.paymentStatus}</p>
                <p><strong>Method:</strong> {booking.paymentMethod}</p>
              </div>

              <div className="booking-total-box">
                <p>Total paid</p>
                <strong>{formatAmount(booking.totalAmount)}</strong>
              </div>
            </article>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default TicketPage;
