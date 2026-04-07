import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageIntro from "../../components/PageIntro";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import { apiRequest } from "../../lib/api";

const paymentOptions = ["Card", "Bank transfer", "Cash"];

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

function PaymentPage() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const [event, setEvent] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

        if (data.price?.trim().toLowerCase() === "free") {
          setPaymentMethod("Free");
        }
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

  async function handleSubmit(eventObject) {
    eventObject.preventDefault();
    setIsSaving(true);
    setError("");

    if (!seatLabels.length || seatLabels.length !== seatCount) {
      setError("Go back and select your seats again.");
      setIsSaving(false);
      return;
    }

    try {
      const data = await apiRequest("/api/bookings", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          eventId: Number(eventId),
          seatCount,
          paymentMethod,
          seatLabels
        })
      });

      navigate(`/booking/tickets/${data.id}`);
    } catch (requestError) {
      setError(requestError.message);
      setIsSaving(false);
    }
  }

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <PageIntro
          eyebrow="Payment"
          title="Pay for your booking."
          description="Check the booking summary, choose a payment method, and confirm the booking."
          actions={(
            <>
              <Link className="ghost-link" to={`/booking/${eventId}/summary?${searchParams.toString()}`}>
                Back to summary
              </Link>
              <Link className="ghost-link" to="/booking">
                My bookings
              </Link>
            </>
          )}
        />

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading payment details...</p>
          </section>
        ) : null}

        {error ? <p className="error-text">{error}</p> : null}

        {event ? (
          <section className="ticket-layout">
            <article className="simple-panel">
              <p className="section-tag">Summary</p>
              <h2 className="panel-title">{event.title}</h2>
              <div className="booking-info-grid">
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p><strong>City:</strong> {event.city}</p>
                <p><strong>Seats:</strong> {seatCount}</p>
                <p><strong>Seat numbers:</strong> {seatLabels.join(", ")}</p>
                <p><strong>Price:</strong> {event.price}</p>
              </div>

              <div className="booking-total-box">
                <p>Total amount</p>
                <strong>{formatAmount(totalAmount)}</strong>
              </div>
            </article>

            <article className="simple-panel">
              <p className="section-tag">Payment method</p>
              <h2 className="panel-title">Choose how you want to pay</h2>

              <form className="booking-form" onSubmit={handleSubmit}>
                <div className="payment-method-list">
                  {event.price?.trim().toLowerCase() === "free" ? (
                    <label className="payment-method-card">
                      <input checked readOnly type="radio" />
                      <div>
                        <strong>Free event</strong>
                        <p>No payment is needed for this booking.</p>
                      </div>
                    </label>
                  ) : (
                    paymentOptions.map((option) => (
                      <label className="payment-method-card" key={option}>
                        <input
                          checked={paymentMethod === option}
                          name="paymentMethod"
                          type="radio"
                          value={option}
                          onChange={(inputEvent) => setPaymentMethod(inputEvent.target.value)}
                        />
                        <div>
                          <strong>{option}</strong>
                          <p>Use {option.toLowerCase()} for this booking.</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>

                <button className="primary-link" disabled={isSaving} type="submit">
                  {isSaving ? "Saving payment..." : "Confirm payment"}
                </button>
              </form>
            </article>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default PaymentPage;
