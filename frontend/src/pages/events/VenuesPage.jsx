import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../lib/api";

function getVenuePath(venue) {
  return `/venues/${encodeURIComponent(venue.city)}/${encodeURIComponent(venue.name)}`;
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
        </section>

        {error ? <p className="error-text">{error}</p> : null}

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading venues...</p>
          </section>
        ) : null}

        {!isLoading && venues.length ? (
          <section className="venue-grid">
            {venues.map((venue) => (
              <article className="event-list-card" key={`${venue.name}-${venue.city}`}>
                <div className="event-list-body">
                  <p className="section-tag">{venue.city}</p>
                  <h2>{venue.name}</h2>
                  <p>{venue.eventCount} event{venue.eventCount === 1 ? "" : "s"} available here.</p>
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
