import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import BookingFlowSteps from "../../components/BookingFlowSteps";
import PageIntro from "../../components/PageIntro";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import { apiRequest } from "../../lib/api";

function parsePrice(price) {
  if (!price || price.trim().toLowerCase() === "free") {
    return 0;
  }

  const cleaned = price.replace(/[^\d.,]/g, "").replaceAll(",", "").trim();
  const amount = Number(cleaned);
  return Number.isNaN(amount) ? 0 : amount;
}

function formatAmount(amount) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2
  }).format(amount);
}

function getSeatValue(value) {
  const amount = Number(value);

  if (Number.isNaN(amount) || amount < 1) {
    return 1;
  }

  return amount;
}

function getSeatLabels(value) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim().toUpperCase())
    .filter((item) => item);
}

function BookingSummaryPage() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const seatCount = getSeatValue(searchParams.get("seats"));
  const seatLabels = getSeatLabels(searchParams.get("labels"));

  useEffect(() => {
    async function loadEvent() {
      setIsLoading(true);
      setError("");

      try {
        const data = await apiRequest(`/api/events/${eventId}`);
        setEvent(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  const totalAmount = useMemo(() => {
    if (!event) {
      return 0;
    }

    return parsePrice(event.price) * seatCount;
  }, [event, seatCount]);

  function handleContinue() {
    setError("");

    if (!seatLabels.length || seatLabels.length !== seatCount) {
      setError("Go back and select your seats again.");
      return;
    }

    navigate(`/booking/${eventId}/payment?${searchParams.toString()}`);
  }

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <PageIntro
          eyebrow="Booking summary"
          title="Check your booking details."
          description="Review the event, selected seats, and total amount before you continue to payment."
          actions={(
            <>
              <Link className="ghost-link" to={`/booking/${eventId}`}>
                Back to seat selection
              </Link>
              <Link className="ghost-link" to="/booking">
                My bookings
              </Link>
            </>
          )}
        >
          <BookingFlowSteps current="Summary" />
        </PageIntro>

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading booking summary...</p>
          </section>
        ) : null}

        {error ? <p className="error-text">{error}</p> : null}

        {event ? (
          <section className="ticket-layout">
            <article className="simple-panel">
              <div className="booking-event-hero booking-event-hero-compact">
                <img
                  className="booking-event-photo"
                  src={event.imageUrl || "/images/concert.png"}
                  alt={event.title}
                />
                <div className="booking-event-copy">
                  <p className="section-tag">{event.category}</p>
                  <h2 className="panel-title">{event.title}</h2>
                  <p className="booking-event-text">{event.shortDescription}</p>
                </div>
              </div>

              <div className="booking-detail-grid">
                <article className="booking-detail-card">
                  <span className="booking-detail-label">Date</span>
                  <strong className="booking-detail-value">{event.date}</strong>
                </article>
                <article className="booking-detail-card">
                  <span className="booking-detail-label">Time</span>
                  <strong className="booking-detail-value">{event.time}</strong>
                </article>
                <article className="booking-detail-card">
                  <span className="booking-detail-label">Venue</span>
                  <strong className="booking-detail-value">{event.venue}</strong>
                </article>
                <article className="booking-detail-card">
                  <span className="booking-detail-label">City</span>
                  <strong className="booking-detail-value">{event.city}</strong>
                </article>
                <article className="booking-detail-card">
                  <span className="booking-detail-label">Price</span>
                  <strong className="booking-detail-value">{event.price}</strong>
                </article>
                <article className="booking-detail-card">
                  <span className="booking-detail-label">Seats left</span>
                  <strong className="booking-detail-value">{event.availableSeats}</strong>
                </article>
              </div>
            </article>

            <article className="simple-panel">
              <p className="section-tag">Before payment</p>
              <h2 className="panel-title">Review your booking</h2>

              <div className="booking-quick-grid">
                <div className="booking-total-box">
                  <p>Seat count</p>
                  <strong>{seatCount}</strong>
                </div>

                <div className="booking-total-box">
                  <p>Total amount</p>
                  <strong>{formatAmount(totalAmount)}</strong>
                </div>
              </div>

              <div className="seat-selection-box">
                <p className="seat-selection-label">Seat numbers</p>
                <div className="selected-seat-list">
                  {seatLabels.map((seatLabel) => (
                    <span className="selected-seat-chip" key={seatLabel}>
                      {seatLabel}
                    </span>
                  ))}
                </div>
              </div>

              <div className="booking-summary-stack">
                <div className="booking-total-box">
                  <p>Price per seat</p>
                  <strong>{event.price}</strong>
                </div>
              </div>

              <div className="booking-note-box">
                <strong>Next step</strong>
                <p>Choose a payment method and confirm the booking.</p>
              </div>

              <div className="auth-link-list">
                <button className="primary-link" type="button" onClick={handleContinue}>
                  Continue to payment
                </button>
                <Link className="ghost-link" to={`/booking/${eventId}`}>
                  Change seats
                </Link>
              </div>
            </article>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default BookingSummaryPage;
