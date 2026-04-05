import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../../lib/api";

function VenueDetailsPage() {
  const { city, venueName } = useParams();
  const [venue, setVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVenue() {
      setIsLoading(true);
      setError("");

      try {
        const data = await apiRequest(
          `/api/events/venues/${encodeURIComponent(city)}/${encodeURIComponent(venueName)}`
        );
        setVenue(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadVenue();
  }, [city, venueName]);

  return (
    <main className="home-page">
      <div className="page-shell">
        <section className="simple-panel">
          <div className="auth-link-list">
            <Link className="ghost-link" to="/venues">
              Back to venues
            </Link>
            <Link className="ghost-link" to="/events">
              Back to events
            </Link>
          </div>

          {isLoading ? <p>Loading venue details...</p> : null}
          {error ? <p className="error-text">{error}</p> : null}

          {venue ? (
            <>
              <p className="section-tag">{venue.city}</p>
              <h1>{venue.name}</h1>
              <p>{venue.eventCount} event{venue.eventCount === 1 ? "" : "s"} available in this venue.</p>

              <section className="venue-event-grid">
                {venue.events.map((event) => (
                  <article className="event-list-card" key={event.id}>
                    <div className="event-list-body">
                      <p className="section-tag">{event.category}</p>
                      <h2>{event.title}</h2>
                      <p className="event-summary-text">{event.shortDescription}</p>
                      <div className="event-meta-grid">
                        <span>{event.date}</span>
                        <span>{event.time}</span>
                        <span>{event.price}</span>
                        <span>{event.availableSeats} seats</span>
                      </div>
                      <Link className="primary-link" to={`/events/${event.id}`}>
                        View event
                      </Link>
                    </div>
                  </article>
                ))}
              </section>
            </>
          ) : null}
        </section>
      </div>
    </main>
  );
}

export default VenueDetailsPage;
