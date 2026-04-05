import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../../lib/api";

function getEventTheme(category) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function EventDetailsPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
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

  return (
    <main className="home-page">
      <div className="page-shell">
        <section className="simple-panel">
          <div className="auth-link-list">
            <Link className="ghost-link" to="/events">
              Back to events
            </Link>
            <Link className="ghost-link" to="/events/create">
              Add event
            </Link>
          </div>

          {isLoading ? <p>Loading event details...</p> : null}
          {error ? <p className="error-text">{error}</p> : null}

          {event ? (
            <div className="event-details-layout">
              <div className="event-details-main">
                <div className={`event-details-image event-theme-${getEventTheme(event.category)}`}>
                  <span className="event-image-badge">{event.category}</span>
                  <div className="event-image-text">
                    <strong>{event.city}</strong>
                    <span>{event.date}</span>
                  </div>
                </div>

                <div className="event-details-box">
                  <p className="section-tag">{event.category}</p>
                  <h1>{event.title}</h1>
                  <p>{event.description}</p>
                </div>

                <div className="event-details-box">
                  <h2>Event details</h2>
                  <div className="event-meta-grid">
                    <span>Date: {event.date}</span>
                    <span>Time: {event.time}</span>
                    <span>City: {event.city}</span>
                    <span>Venue: {event.venue}</span>
                  </div>
                </div>
              </div>

              <aside className="event-details-side">
                <div className="event-details-box">
                  <h2>Booking info</h2>
                  <p>Price: {event.price}</p>
                  <p>Seats left: {event.availableSeats}</p>
                  <Link className="primary-link" to="/booking">
                    Continue to booking
                  </Link>
                </div>
              </aside>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

export default EventDetailsPage;
