import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../lib/api";

function getVenuePath(venue) {
  return `/venues/${encodeURIComponent(venue.city)}/${encodeURIComponent(venue.name)}`;
}

function getVenueTheme(index) {
  return `venue-card-theme-${(index % 4) + 1}`;
}

function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVenues() {
      setIsLoading(true);
      setError("");

      try {
        const data = await apiRequest("/api/events/venues");
        setVenues(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadVenues();
  }, []);

  return (
    <main className="home-page">
      <div className="page-shell">
        <section className="simple-panel">
          <p className="section-tag">Venues</p>
          <h1>Browse event venues.</h1>
          <p>Check venue names, cities, and how many events are available in each place.</p>

          <div className="auth-link-list">
            <Link className="ghost-link" to="/events">
              Back to events
            </Link>
          </div>

          {!isLoading && venues.length ? (
            <div className="venue-summary-grid">
              <article>
                <strong>{venues.length}</strong>
                <span>venue locations</span>
              </article>
              <article>
                <strong>{venues.reduce((total, venue) => total + venue.eventCount, 0)}</strong>
                <span>events linked</span>
              </article>
              <article>
                <strong>{new Set(venues.map((venue) => venue.city)).size}</strong>
                <span>cities covered</span>
              </article>
            </div>
          ) : null}
        </section>

        {error ? <p className="error-text">{error}</p> : null}

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading venues...</p>
          </section>
        ) : null}

        {!isLoading && venues.length ? (
          <section className="venue-grid">
            {venues.map((venue, index) => (
              <article className={`venue-card ${getVenueTheme(index)}`} key={`${venue.name}-${venue.city}`}>
                <div className="venue-showcase">
                  <div className="venue-showcase-label">
                    <span>{venue.city}</span>
                    <strong>{venue.name}</strong>
                    <p>{venue.eventCount} event{venue.eventCount === 1 ? "" : "s"}</p>
                  </div>
                  <div className="venue-showcase-image venue-showcase-image-main" />
                  <div className="venue-showcase-image venue-showcase-image-side" />
                </div>
                <div className="venue-card-body">
                  <h2>{venue.name}</h2>
                  <p className="venue-card-title">{venue.city} venue for live events and bookings.</p>
                  <p className="venue-card-meta">{venue.city}</p>
                  <p className="venue-card-meta">{venue.eventCount} event{venue.eventCount === 1 ? "" : "s"} available</p>
                  <Link className="primary-link" to={getVenuePath(venue)}>
                    View venue
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

export default VenuesPage;
