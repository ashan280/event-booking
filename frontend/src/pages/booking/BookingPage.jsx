import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BookingFlowSteps from "../../components/BookingFlowSteps";
import PageIntro from "../../components/PageIntro";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import { apiRequest } from "../../lib/api";

const SEATS_PER_ROW = 6;

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

function getRowLabel(index) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  if (index < alphabet.length) {
    return alphabet[index];
  }

  const first = Math.floor(index / alphabet.length) - 1;
  const second = index % alphabet.length;
  return `${alphabet[first]}${alphabet[second]}`;
}

function buildSeatRows(totalSeats) {
  const rows = [];
  const safeTotal = Math.max(Number(totalSeats || 0), 0);
  let seatNumber = 1;
  let rowIndex = 0;

  while (seatNumber <= safeTotal) {
    const rowSeats = [];
    const rowLabel = getRowLabel(rowIndex);

    for (let column = 1; column <= SEATS_PER_ROW && seatNumber <= safeTotal; column += 1) {
      rowSeats.push(`${rowLabel}${column}`);
      seatNumber += 1;
    }

    rows.push(rowSeats);
    rowIndex += 1;
  }

  return rows;
}

function BookingPage() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [seatInfo, setSeatInfo] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookingData() {
      setIsLoading(true);
      setError("");

      try {
        const [eventData, seatData] = await Promise.all([
          apiRequest(`/api/events/${eventId}`),
          apiRequest(`/api/bookings/events/${eventId}/seats`)
        ]);

        setEvent(eventData);
        setSeatInfo(seatData);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadBookingData();
  }, [eventId]);

  const bookedSeatSet = useMemo(
    () => new Set((seatInfo?.bookedSeats || []).map((seatLabel) => seatLabel.toUpperCase())),
    [seatInfo]
  );

  const seatRows = useMemo(
    () => buildSeatRows(seatInfo?.totalSeats || event?.availableSeats || 0),
    [event?.availableSeats, seatInfo?.totalSeats]
  );

  const totalAmount = useMemo(() => {
    if (!event) {
      return 0;
    }

    return parsePrice(event.price) * selectedSeats.length;
  }, [event, selectedSeats.length]);

  function toggleSeat(seatLabel) {
    if (bookedSeatSet.has(seatLabel)) {
      return;
    }

    setSelectedSeats((currentSeats) => {
      if (currentSeats.includes(seatLabel)) {
        return currentSeats.filter((item) => item !== seatLabel);
      }

      return [...currentSeats, seatLabel];
    });
  }

  function clearSelection() {
    setSelectedSeats([]);
  }

  function handleSubmit(eventObject) {
    eventObject.preventDefault();
    setError("");

    if (!selectedSeats.length) {
      setError("Select at least one seat.");
      return;
    }

    if (event && selectedSeats.length > event.availableSeats) {
      setError("Selected seats are more than the seats left.");
      return;
    }

    const searchParams = new URLSearchParams({
      seats: String(selectedSeats.length),
      labels: selectedSeats.join(",")
    });

    navigate(`/booking/${eventId}/summary?${searchParams.toString()}`);
  }

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <PageIntro
          eyebrow="Booking"
          title="Choose your seats"
          description="Pick the seats you want, watch the total update, and continue when everything looks right."
          actions={(
            <>
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
            </>
          )}
        >
          <BookingFlowSteps current="Seats" />
        </PageIntro>

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading booking details...</p>
          </section>
        ) : null}

        {error ? <p className="error-text">{error}</p> : null}

        {event && seatInfo ? (
          <section className="booking-layout">
            <article className="simple-panel">
              <div className="booking-event-hero">
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
                  <strong className="booking-detail-value">{seatInfo.availableSeats}</strong>
                </article>
              </div>

              <div className="booking-screen-bar">
                <span>Stage view</span>
              </div>

              <div className="seat-legend">
                <span><i className="seat-box seat-box-open" /> Open</span>
                <span><i className="seat-box seat-box-selected" /> Selected</span>
                <span><i className="seat-box seat-box-booked" /> Booked</span>
              </div>

              <div className="seat-map">
                {seatRows.map((rowSeats, rowIndex) => (
                  <div className="seat-row" key={`row-${rowIndex + 1}`}>
                    <span className="seat-row-label">{getRowLabel(rowIndex)}</span>
                    <div className="seat-row-grid">
                      {rowSeats.map((seatLabel) => {
                        const isBooked = bookedSeatSet.has(seatLabel);
                        const isSelected = selectedSeats.includes(seatLabel);

                        return (
                          <button
                            key={seatLabel}
                            className={`seat-button${isBooked ? " is-booked" : ""}${isSelected ? " is-selected" : ""}`}
                            type="button"
                            onClick={() => toggleSeat(seatLabel)}
                            disabled={isBooked}
                          >
                            {seatLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="simple-panel">
              <h2 className="panel-title">Booking summary</h2>
              <p className="booking-side-note">Your seat choice will be checked one more time before payment is confirmed.</p>

              <div className="booking-quick-grid">
                <div className="booking-total-box">
                  <p>Selected seats</p>
                  <strong>{selectedSeats.length}</strong>
                </div>

                <div className="booking-total-box">
                  <p>Total amount</p>
                  <strong>{formatAmount(totalAmount)}</strong>
                </div>
              </div>

              <div className="booking-summary-stack">
                <div className="seat-selection-box">
                  <p className="seat-selection-label">Seat numbers</p>
                  {selectedSeats.length ? (
                    <div className="selected-seat-list">
                      {selectedSeats.map((seatLabel) => (
                        <span className="selected-seat-chip" key={seatLabel}>
                          {seatLabel}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="seat-selection-empty">No seats selected yet. Choose any available seats from the map.</p>
                  )}
                </div>

                <div className="booking-total-box">
                  <p>Price per seat</p>
                  <strong>{event.price}</strong>
                </div>
              </div>

              <form className="booking-form" onSubmit={handleSubmit}>
                <button className="primary-link" type="submit" disabled={!selectedSeats.length}>
                  Continue to summary
                </button>
                <button className="ghost-link" type="button" onClick={clearSelection}>
                  Clear selection
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
