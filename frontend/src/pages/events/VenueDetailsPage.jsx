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
              <div className="venue-hero">
                <div className="venue-hero-copy">
                  <p className="section-tag">{venue.city}</p>
                  <h1>{venue.name}</h1>
                  <p>{venue.eventCount} event{venue.eventCount === 1 ? "" : "s"} available in this venue.</p>
                </div>

                <div className="venue-summary-grid">
                  <article>
                    <strong>{venue.eventCount}</strong>
                    <span>events now</span>
                  </article>
                  <article>
                    <strong>{venue.city}</strong>
                    <span>location</span>
                  </article>
                </div>
              </div>

              <section className="venue-event-grid">
                {venue.events.map((event) => (
                  <article className="venue-card simple-list-card" key={event.id}>
                    <p className="section-tag">{event.category}</p>
                    <div className="venue-card-body">
                      <h2>{event.title}</h2>
                      <p className="venue-card-title">{event.shortDescription}</p>
                      <p className="venue-card-meta">{event.date} | {event.time}</p>
                      <p className="venue-card-meta">{event.price}</p>
                      <p className="venue-card-meta">{event.availableSeats} seats left</p>
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
