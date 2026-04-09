import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import BookingFlowSteps from "../../components/BookingFlowSteps";
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
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
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

    if (paymentMethod === "Card") {
      if (!cardName.trim() || !cardNumber.trim() || !expiryDate.trim() || !cvv.trim()) {
        setError("Fill in the card details.");
        setIsSaving(false);
        return;
      }
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

      let paymentState = "pending";

      if (data.paymentStatus === "PAID") {
        paymentState = "success";
      } else if (data.paymentStatus === "FREE") {
        paymentState = "free";
      }

      navigate(`/booking/tickets/${data.id}?payment=${paymentState}`);
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
        >
          <BookingFlowSteps current="Payment" />
        </PageIntro>

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading payment details...</p>
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
                  <p className="section-tag">Summary</p>
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
                  <span className="booking-detail-label">Seats</span>
                  <strong className="booking-detail-value">{seatCount}</strong>
                </article>
                <article className="booking-detail-card">
                  <span className="booking-detail-label">Price</span>
                  <strong className="booking-detail-value">{event.price}</strong>
                </article>
                <article className="booking-detail-card booking-detail-card-wide">
                  <span className="booking-detail-label">Seat numbers</span>
                  <strong className="booking-detail-value">{seatLabels.join(", ")}</strong>
                </article>
              </div>

              <div className="booking-total-box">
                <p>Total amount</p>
                <strong>{formatAmount(totalAmount)}</strong>
              </div>
            </article>

            <article className="simple-panel">
              <p className="section-tag">Payment method</p>
              <h2 className="panel-title">Choose how you want to pay</h2>
              <p className="booking-side-note">Choose a payment method and confirm your booking details here.</p>

              <form className="booking-form" onSubmit={handleSubmit}>
                <div className="payment-method-list">
                  {event.price?.trim().toLowerCase() === "free" ? (
                    <div className="payment-free-card">
                      <div className="payment-free-icon">OK</div>
                      <div>
                        <strong>Free event</strong>
                        <p>No payment is needed for this booking. You can confirm and get your ticket now.</p>
                      </div>
                    </div>
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
                        <div className="payment-method-copy">
                          <strong>{option}</strong>
                          <p>Use {option.toLowerCase()} for this booking.</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>

                {paymentMethod === "Card" ? (
                  <div className="payment-form-grid">
                    <label>
                      Card holder name
                      <input
                        type="text"
                        placeholder="Name on card"
                        value={cardName}
                        onChange={(eventObject) => setCardName(eventObject.target.value)}
                      />
                    </label>
                    <label className="payment-form-wide">
                      Card number
                      <input
                        type="text"
                        placeholder="1111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(eventObject) => setCardNumber(eventObject.target.value)}
                      />
                    </label>
                    <label>
                      Expiry date
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(eventObject) => setExpiryDate(eventObject.target.value)}
                      />
                    </label>
                    <label>
                      CVV
                      <input
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={(eventObject) => setCvv(eventObject.target.value)}
                      />
                    </label>
                  </div>
                ) : null}

                {paymentMethod === "Bank transfer" ? (
                  <div className="booking-note-box">
                    <strong>Bank transfer</strong>
                    <p>Use your booking number as the payment reference after confirmation.</p>
                  </div>
                ) : null}

                {paymentMethod === "Cash" ? (
                  <div className="booking-note-box">
                    <strong>Cash payment</strong>
                    <p>Complete the booking now and pay at the venue counter before the event starts.</p>
                  </div>
                ) : null}

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
