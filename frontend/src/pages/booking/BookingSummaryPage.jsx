import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import { apiRequest } from "../../lib/api";

function parsePrice(price) {
  if (!price || price.trim().toLowerCase() === "free") {
    return 0;
  }

  const cleaned = price.replace("LKR", "").replaceAll(",", "").trim();
  const amount = Number(cleaned);
  return Number.isNaN(amount) ? 0 : amount;
}

function formatAmount(amount) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
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

        <section className="simple-panel">
          <p className="section-tag">Booking summary</p>
          <h1>Check your booking details.</h1>
          <p>Review the event, selected seats, and total amount before you continue to payment.</p>

          <div className="auth-link-list">
            <Link className="ghost-link" to={`/booking/${eventId}`}>
              Back to seat selection
            </Link>
            <Link className="ghost-link" to="/booking">
              My bookings
            </Link>
          </div>
        </section>

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading booking summary...</p>
          </section>
        ) : null}

        {error ? <p className="error-text">{error}</p> : null}

        {event ? (
          <section className="ticket-layout">
            <article className="simple-panel">
              <p className="section-tag">{event.category}</p>
              <h2 className="panel-title">{event.title}</h2>

              <div className="booking-info-grid">
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p><strong>City:</strong> {event.city}</p>
                <p><strong>Price:</strong> {event.price}</p>
                <p><strong>Seats left:</strong> {event.availableSeats}</p>
              </div>
            </article>

            <article className="simple-panel">
              <p className="section-tag">Your seats</p>
              <h2 className="panel-title">Ready to pay</h2>

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
                  <p>Seat count</p>
                  <strong>{seatCount}</strong>
                </div>

                <div className="booking-total-box">
                  <p>Total amount</p>
                  <strong>{formatAmount(totalAmount)}</strong>
                </div>
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
