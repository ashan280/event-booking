import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PublicSiteHeader from "../components/PublicSiteHeader";
import { apiRequest } from "../lib/api";

/* Get today's date as YYYY-MM-DD */
function getTodayValue() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/* Format date string to short label like "Mon, 5 Apr" */
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

/* Pick a category image from the public/images folder */
function getCategoryImage(category) {
  const lower = (category || "").toLowerCase();

  if (lower.includes("music") || lower.includes("concert")) return "/images/concert.png";
  if (lower.includes("business") || lower.includes("conference")) return "/images/conference.png";
  if (lower.includes("sport")) return "/images/sports.png";
  if (lower.includes("food") || lower.includes("drink")) return "/images/food.png";
  if (lower.includes("workshop") || lower.includes("art")) return "/images/workshop.png";
  return "/images/concert.png";
}

function HomePage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  /* Load events from backend API */
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

  /* Sort events by date */
  const sortedEvents = useMemo(
    () => [...events].sort((first, second) => first.date.localeCompare(second.date)),
    [events]
  );

  /* Filter today's events */
  const todayEvents = useMemo(
    () => sortedEvents.filter((event) => event.date === todayValue),
    [sortedEvents, todayValue]
  );

  /* Get next 4 upcoming events */
  const upcomingEvents = useMemo(
    () => sortedEvents.filter((event) => event.date >= todayValue).slice(0, 4),
    [sortedEvents, todayValue]
  );

  /* Group events by city for location cards */
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

  /* Get unique categories */
  const categories = useMemo(
    () => Array.from(new Set(sortedEvents.map((event) => event.category))).slice(0, 6),
    [sortedEvents]
  );

  /* Pick a spotlight event (today's first event, or first upcoming, or first event) */
  const spotlightEvent = todayEvents[0] || upcomingEvents[0] || sortedEvents[0];

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        {/* Hero banner with image */}
        <div className="hero-image-container">
          <img src="/images/hero.png" alt="Event Booking Hero - discover amazing events" />
          <div className="hero-image-overlay">
            <h2>Discover Amazing Events Near You</h2>
            <p>Book seats, find venues, and enjoy unforgettable experiences</p>
          </div>
        </div>

        {/* Hero section with stats and spotlight */}
        <section className="hero-section home-hero">
          <div className="hero-copy">
            <p className="section-tag">What&apos;s on</p>
            <h1>Browse events, book seats, and enjoy the show.</h1>
            <p className="hero-text">
              Find today&apos;s events, check upcoming plans, and book your seats in a few simple steps.
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
                <span>Events live</span>
              </article>
              <article>
                <strong>{todayEvents.length}</strong>
                <span>Today</span>
              </article>
              <article>
                <strong>{locationCards.length}</strong>
                <span>Locations</span>
              </article>
            </div>
          </div>

          {/* Spotlight panel - shows a featured event */}
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
            {/* Today's events section */}
            <section className="featured-section">
              <div className="section-head">
                <p className="section-tag">Today</p>
                <h2>Today&apos;s events</h2>
              </div>

              {todayEvents.length ? (
                <div className="event-grid">
                  {todayEvents.map((event) => (
                    <article className="event-card" key={event.id}>
                      <img
                        className="event-card-image"
                        src={getCategoryImage(event.category)}
                        alt={event.title}
                      />
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

            {/* Upcoming events section */}
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

            {/* Browse by location section */}
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

            {/* Browse by category section */}
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

        {/* Footer */}
        <footer className="site-footer">
          <p><strong>EventHub</strong> — Event Booking & Seat Reservation System</p>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/events">Events</Link>
            <Link to="/venues">Venues</Link>
            <Link to="/auth">Account</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default HomePage;
