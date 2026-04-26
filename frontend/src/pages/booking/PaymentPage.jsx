import { useEffect, useMemo, useRef, useState } from "react";
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

function formatAmount(amount, currency = "EUR") {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
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

function isFreeEvent(price) {
  return !price || price.trim().toLowerCase() === "free";
}

function loadPayPalScript(clientId, currency) {
  const existingScript = document.querySelector("script[data-paypal-sdk='true']");

  if (
    window.paypal?.Buttons &&
    existingScript?.dataset.clientId === clientId &&
    existingScript?.dataset.currency === currency
  ) {
    return Promise.resolve(window.paypal);
  }

  if (existingScript) {
    existingScript.remove();
    delete window.paypal;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}&intent=capture&disable-funding=credit,card,venmo,paylater&components=buttons&commit=true`;
    script.async = true;
    script.dataset.paypalSdk = "true";
    script.dataset.clientId = clientId;
    script.dataset.currency = currency;
    script.addEventListener("load", () => resolve(window.paypal), { once: true });
    script.addEventListener("error", () => reject(new Error("PayPal script could not be loaded")), { once: true });
    document.body.appendChild(script);
  });
}

function PaymentPage() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const [event, setEvent] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [paypalConfig, setPayPalConfig] = useState({
    enabled: false,
    clientId: "",
    currency: "EUR",
    note: ""
  });
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [paypalMessage, setPayPalMessage] = useState("");
  const [isPayPalReady, setIsPayPalReady] = useState(false);
  const paypalButtonsRef = useRef(null);
  const seatCount = getSeatValue(searchParams.get("seats"));
  const seatLabelsText = searchParams.get("labels") || "";
  const seatLabels = useMemo(() => getSeatLabels(seatLabelsText), [seatLabelsText]);

  function clearPayPalButtons() {
    if (paypalButtonsRef.current) {
      paypalButtonsRef.current.innerHTML = "";
    }
  }

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError("");

      try {
        const [eventData, configData] = await Promise.all([
          apiRequest(`/api/events/${eventId}`),
          apiRequest("/api/payments/paypal/config")
        ]);

        setEvent(eventData);
        setPayPalConfig(configData);

        if (isFreeEvent(eventData.price)) {
          setPaymentMethod("Free");
        } else if (configData.enabled) {
          setPaymentMethod("PayPal");
        }
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [eventId]);

  const totalAmount = useMemo(() => {
    if (!event) {
      return 0;
    }

    return parsePrice(event.price) * seatCount;
  }, [event, seatCount]);

  const availablePaymentOptions = useMemo(() => {
    const options = ["Card", "Bank transfer", "Cash"];
    return paypalConfig.enabled ? ["PayPal", ...options] : options;
  }, [paypalConfig.enabled]);

  useEffect(() => {
    if (!event || paymentMethod !== "PayPal" || !paypalConfig.enabled || isFreeEvent(event.price)) {
      setIsPayPalReady(false);
      setPayPalMessage("");
      clearPayPalButtons();
      return;
    }

    if (!seatLabels.length || seatLabels.length !== seatCount) {
      setIsPayPalReady(false);
      setPayPalMessage("Go back and select your seats again before using PayPal.");
      clearPayPalButtons();
      return;
    }

    let cancelled = false;
    const bookingPayload = {
      eventId: Number(eventId),
      seatCount,
      seatLabels,
      paymentMethod: "PayPal"
    };

    async function renderPayPalButtons() {
      setIsPayPalReady(false);
      setPayPalMessage("Loading PayPal...");

      try {
        const paypal = await loadPayPalScript(paypalConfig.clientId, paypalConfig.currency);

        if (cancelled || !paypalButtonsRef.current) {
          return;
        }

        clearPayPalButtons();

        await paypal.Buttons({
          style: {
            layout: "vertical",
            shape: "rect",
            label: "paypal"
          },
          createOrder: async () => {
            setError("");
            setPayPalMessage("Creating PayPal order...");

            try {
              const order = await apiRequest("/api/payments/paypal/orders", {
                method: "POST",
                auth: true,
                body: JSON.stringify(bookingPayload)
              });

              return order.orderId;
            } catch (requestError) {
              setError(requestError.message);
              setPayPalMessage("");
              throw requestError;
            }
          },
          onApprove: async (approveData) => {
            setIsSaving(true);
            setError("");
            setPayPalMessage("Processing payment...");

            try {
              const result = await apiRequest(
                `/api/payments/paypal/orders/${approveData.orderID}/capture`,
                {
                  method: "POST",
                  auth: true,
                  body: JSON.stringify(bookingPayload)
                }
              );

              navigate(`/booking/tickets/${result.booking.id}?payment=success`);
            } catch (requestError) {
              setError(requestError.message);
              setPayPalMessage("PayPal payment could not be completed. Please try again.");
              setIsSaving(false);
            }
          },
          onCancel: () => {
            setIsSaving(false);
            setPayPalMessage("PayPal payment was cancelled.");
          },
          onError: (requestError) => {
            console.error("PayPal error:", requestError);
            setIsSaving(false);
            setError("PayPal payment could not be completed. Please try again.");
            setPayPalMessage("");
          }
        }).render(paypalButtonsRef.current);

        if (!cancelled) {
          setIsPayPalReady(true);
          setPayPalMessage("Click the PayPal button below to pay.");
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message);
          setPayPalMessage("");
        }
      }
    }

    renderPayPalButtons();

    return () => {
      cancelled = true;
      clearPayPalButtons();
    };
  }, [event, eventId, navigate, paymentMethod, paypalConfig.clientId, paypalConfig.currency, paypalConfig.enabled, seatCount, seatLabels, seatLabelsText]);

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
          title="Complete your booking"
          description="Review the summary, choose a payment method, and confirm everything in one place."
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
                <strong>{formatAmount(totalAmount, paypalConfig.currency || "EUR")}</strong>
              </div>
            </article>

            <article className="simple-panel">
              <p className="section-tag">Payment method</p>
              <h2 className="panel-title">Choose how you want to pay</h2>
              <p className="booking-side-note">Pick the option that suits you best and then finish the booking.</p>

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
                    availablePaymentOptions.map((option) => (
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

                {paymentMethod === "PayPal" ? (
                  <div className="paypal-box">
                    <strong>PayPal Sandbox</strong>
                    <p>{paypalConfig.note}</p>
                    <div className="paypal-summary-line">
                      <span>Total</span>
                      <strong>{formatAmount(totalAmount, paypalConfig.currency || "EUR")}</strong>
                    </div>
                    {paypalMessage ? <p className="paypal-helper-text">{paypalMessage}</p> : null}
                    <div
                      className={`paypal-button-wrap${isPayPalReady ? " paypal-button-wrap-ready" : ""}`}
                      ref={paypalButtonsRef}
                    />
                  </div>
                ) : null}

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

                {paymentMethod !== "PayPal" ? (
                  <button className="primary-link" disabled={isSaving} type="submit">
                    {isSaving ? "Saving payment..." : "Confirm payment"}
                  </button>
                ) : null}
              </form>
            </article>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default PaymentPage;
