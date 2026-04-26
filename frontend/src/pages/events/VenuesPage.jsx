import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageIntro from "../../components/PageIntro";
import PublicSiteHeader from "../../components/PublicSiteHeader";
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
        <PublicSiteHeader />

        <PageIntro
          eyebrow="Venues"
          title="Browse venues"
          description="Explore where events are happening and see how active each venue is before you book."
          actions={(
            <Link className="ghost-link" to="/events">
              Back to events
            </Link>
          )}
        >
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
        </PageIntro>

        {error ? <p className="error-text">{error}</p> : null}

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading venues...</p>
          </section>
        ) : null}

        {!isLoading && venues.length ? (
          <section className="venue-grid">
            {venues.map((venue) => (
              <article className="venue-card simple-list-card" key={`${venue.name}-${venue.city}`}>
                <p className="section-tag">{venue.city}</p>
                <div className="venue-card-body">
                  <h2>{venue.name}</h2>
                  <p className="venue-card-title">A venue used for event bookings in {venue.city}.</p>
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
