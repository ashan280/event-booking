import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

function BookingPage() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [seatCount, setSeatCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

    return parsePrice(event.price) * Number(seatCount || 0);
  }, [event, seatCount]);

  function handleSubmit(eventObject) {
    eventObject.preventDefault();
    setError("");

    const selectedSeatCount = Number(seatCount);

    if (Number.isNaN(selectedSeatCount) || selectedSeatCount < 1) {
      setError("Enter a valid number of seats.");
      return;
    }

    if (event && selectedSeatCount > event.availableSeats) {
      setError("Selected seats are more than the seats left.");
      return;
    }

    navigate(`/booking/${eventId}/payment?seats=${selectedSeatCount}`);
  }

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <section className="simple-panel">
          <p className="section-tag">Booking</p>
          <h1>Book your event.</h1>
          <p>Only signed-in users can book. Check the event details and confirm the number of seats.</p>

          <div className="auth-link-list">
            <Link className="ghost-link" to="/events">
              Back to events
            </Link>
            {event ? (
              <Link className="ghost-link" to={`/events/${event.id}`}>
                Back to event
              </Link>
            ) : null}
            <Link className="ghost-link" to="/booking">
              My bookings
            </Link>
          </div>
        </section>

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading booking details...</p>
          </section>
        ) : null}

        {error ? <p className="error-text">{error}</p> : null}

        {event ? (
          <section className="booking-layout">
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
              <h2 className="panel-title">Your booking</h2>
              <form className="booking-form" onSubmit={handleSubmit}>
                <label>
                  Number of seats
                  <input
                    min="1"
                    max={event.availableSeats}
                    type="number"
                    value={seatCount}
                    onChange={(inputEvent) => setSeatCount(inputEvent.target.value)}
                  />
                </label>

                <div className="booking-total-box">
                  <p>Total amount</p>
                  <strong>{formatAmount(totalAmount)}</strong>
                </div>

                <button className="primary-link" type="submit">
                  Continue to payment
                </button>
              </form>
            </article>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default BookingPage;
