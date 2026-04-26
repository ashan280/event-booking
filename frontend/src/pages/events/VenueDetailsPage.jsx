import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageIntro from "../../components/PageIntro";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import { apiRequest } from "../../lib/api";
import { DEFAULT_EVENT_IMAGE } from "../../lib/constants";

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
        <PublicSiteHeader />

        {venue ? (
          <PageIntro
            eyebrow={venue.city}
            title={venue.name}
            description={`${venue.eventCount} event${venue.eventCount === 1 ? "" : "s"} available in this venue.`}
            actions={(
              <>
                <Link className="ghost-link" to="/venues">
                  Back to venues
                </Link>
                <Link className="ghost-link" to="/events">
                  Back to events
                </Link>
              </>
            )}
          >
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
          </PageIntro>
        ) : null}

        {isLoading ? <section className="simple-panel"><p>Loading venue details...</p></section> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {venue ? (
          <section className="venue-event-grid">
            {venue.events.map((event) => (
              <article className="event-list-card venue-event-card" key={event.id}>
                <div className="event-list-image">
                  <img
                    className="event-list-card-image"
                    src={event.imageUrl || DEFAULT_EVENT_IMAGE}
                    alt={event.title}
                  />
                  <span className="event-image-badge">{event.category}</span>
                </div>
                <div className="event-list-body">
                  <h2>{event.title}</h2>
                  <p className="event-summary-text">{event.shortDescription}</p>
                  <div className="event-meta-grid">
                    <span>{event.date}</span>
                    <span>{event.time}</span>
                    <span>{event.price}</span>
                    <span>{event.availableSeats} seats left</span>
                  </div>
                  <p className="event-venue-text">{event.city} | {event.venue}</p>
                  <Link className="primary-link" to={`/events/${event.id}`}>
                    View event
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default VenueDetailsPage;
