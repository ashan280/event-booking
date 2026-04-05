import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PublicSiteHeader from "../components/PublicSiteHeader";
import { apiRequest } from "../lib/api";

function getTodayValue() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateLabel(value) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}

function HomePage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHomeEvents() {
      setIsLoading(true);
      setError("");

      try {
        const data = await apiRequest("/api/events");
        setEvents(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadHomeEvents();
  }, []);

  const todayValue = getTodayValue();

  const sortedEvents = useMemo(
    () => [...events].sort((first, second) => first.date.localeCompare(second.date)),
    [events]
  );

  const todayEvents = useMemo(
    () => sortedEvents.filter((event) => event.date === todayValue),
    [sortedEvents, todayValue]
  );

  const upcomingEvents = useMemo(
    () => sortedEvents.filter((event) => event.date >= todayValue).slice(0, 4),
    [sortedEvents, todayValue]
  );

  const locationCards = useMemo(() => {
    const cityMap = new Map();

    sortedEvents.forEach((event) => {
      const current = cityMap.get(event.city);

      if (current) {
        current.count += 1;
      } else {
        cityMap.set(event.city, {
          city: event.city,
          count: 1,
          venue: event.venue
        });
      }
    });

    return Array.from(cityMap.values()).slice(0, 4);
  }, [sortedEvents]);

  const categories = useMemo(
    () => Array.from(new Set(sortedEvents.map((event) => event.category))).slice(0, 6),
    [sortedEvents]
  );

  const spotlightEvent = todayEvents[0] || upcomingEvents[0] || sortedEvents[0];

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <section className="hero-section home-hero">
          <div className="hero-copy">
            <p className="section-tag">What&apos;s on</p>
            <h1>See today&apos;s events, upcoming plans, and places to go.</h1>
            <p className="hero-text">
              Start from today&apos;s picks, check upcoming events, then move to booking in a simple flow.
            </p>

            <div className="hero-actions">
              <Link className="primary-link" to="/events">
                Browse all events
              </Link>
              <Link className="ghost-link" to="/venues">
                Browse venues
              </Link>
            </div>

            <div className="hero-stats">
              <article>
                <strong>{events.length}</strong>
                <span>events live</span>
              </article>
              <article>
                <strong>{todayEvents.length}</strong>
                <span>events today</span>
              </article>
              <article>
                <strong>{locationCards.length}</strong>
                <span>main locations</span>
              </article>
            </div>
          </div>

          <aside className="spotlight-panel">
            <p className="search-eyebrow">Event spotlight</p>
            {spotlightEvent ? (
              <>
                <h2>{spotlightEvent.title}</h2>
                <p>{spotlightEvent.shortDescription}</p>
                <div className="spotlight-meta">
                  <span>{formatDateLabel(spotlightEvent.date)}</span>
                  <span>{spotlightEvent.time}</span>
                  <span>{spotlightEvent.city}</span>
                  <span>{spotlightEvent.price}</span>
                </div>
                <p className="spotlight-venue">{spotlightEvent.venue}</p>
                <Link className="primary-link" to={`/events/${spotlightEvent.id}`}>
                  View event
                </Link>
              </>
            ) : (
              <p>Events will show here after the event list loads.</p>
            )}
          </aside>
        </section>

        {error ? <p className="error-text">{error}</p> : null}

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading home page events...</p>
          </section>
        ) : null}

        {!isLoading ? (
          <>
            <section className="featured-section">
              <div className="section-head">
                <p className="section-tag">Today</p>
                <h2>Today&apos;s events</h2>
              </div>

              {todayEvents.length ? (
                <div className="event-grid">
                  {todayEvents.map((event) => (
                    <article className="event-card" key={event.id}>
                      <div className="event-image">
                        <span>{event.category}</span>
                      </div>
                      <div className="event-content">
                        <p className="event-date">{formatDateLabel(event.date)}</p>
                        <h3>{event.title}</h3>
                        <p>{event.city} | {event.venue}</p>
                        <strong>{event.price}</strong>
                        <Link className="primary-link" to={`/events/${event.id}`}>
                          View event
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <section className="simple-panel compact-panel">
                  <p>No events are marked for today. Check the upcoming section below.</p>
                </section>
              )}
            </section>

            <section className="collection-section">
              <div className="section-head">
                <p className="section-tag">Upcoming</p>
                <h2>Upcoming events</h2>
              </div>
              <div className="collection-grid">
                {upcomingEvents.map((event) => (
                  <article className="collection-card" key={event.id}>
                    <p className="collection-kicker">{formatDateLabel(event.date)}</p>
                    <h3>{event.title}</h3>
                    <p>{event.city} | {event.venue}</p>
                    <p>{event.shortDescription}</p>
                    <Link className="ghost-link" to={`/events/${event.id}`}>
                      Open details
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            <section className="collection-section">
              <div className="section-head">
                <p className="section-tag">Locations</p>
                <h2>Browse by location</h2>
              </div>
              <div className="collection-grid">
                {locationCards.map((location) => (
                  <article className="collection-card" key={location.city}>
                    <p className="collection-kicker">{location.city}</p>
                    <h3>{location.count} event{location.count === 1 ? "" : "s"}</h3>
                    <p>Main venue: {location.venue}</p>
                    <Link className="ghost-link" to={`/events?city=${encodeURIComponent(location.city)}`}>
                      View city events
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            <section className="category-section">
              <div className="section-head">
                <p className="section-tag">Quick filters</p>
                <h2>Browse by category</h2>
              </div>
              <div className="category-list">
                {categories.map((category) => (
                  <Link
                    className="category-chip"
                    key={category}
                    to={`/events?category=${encodeURIComponent(category)}`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}

export default HomePage;
