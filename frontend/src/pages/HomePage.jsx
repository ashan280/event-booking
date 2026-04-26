import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PublicSiteHeader from "../components/PublicSiteHeader";
import { apiRequest } from "../lib/api";
import { DEFAULT_EVENT_IMAGE } from "../lib/constants";

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

function getEventImage(event) {
  return event.imageUrl || DEFAULT_EVENT_IMAGE;
}

function getCategorySummary(events) {
  const categoryMap = new Map();

  events.forEach((event) => {
    const current = categoryMap.get(event.category);

    if (current) {
      current.count += 1;
      if (event.date < current.nextDate) {
        current.nextDate = event.date;
      }
    } else {
      categoryMap.set(event.category, {
        name: event.category,
        count: 1,
        nextDate: event.date
      });
    }
  });

  return Array.from(categoryMap.values())
    .sort((first, second) => first.nextDate.localeCompare(second.nextDate))
    .slice(0, 4);
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
    () => sortedEvents.filter((event) => event.date > todayValue),
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

    return Array.from(cityMap.values());
  }, [sortedEvents]);

  const categoryCards = useMemo(
    () => getCategorySummary(sortedEvents),
    [sortedEvents]
  );

  const spotlightEvent = todayEvents[0] || upcomingEvents[0] || sortedEvents[0];
  const featuredEvents = todayEvents.length ? todayEvents.slice(0, 3) : upcomingEvents.slice(0, 3);
  const whyChooseCards = [
    {
      title: "Easy booking",
      text: "You can go from event list to seat booking and payment in a simple flow."
    },
    {
      title: "All in one place",
      text: "Bookings, tickets, and event details are kept together so they are easy to find."
    },
    {
      title: "Simple browsing",
      text: "You can browse by city, venue, and category to find an event more easily."
    }
  ];
  const footerLinks = [
    {
      title: "Explore",
      links: [
        { label: "All events", to: "/events" },
        { label: "Venues", to: "/venues" },
        { label: "My account", to: "/auth" }
      ]
    },
    {
      title: "Booking",
      links: [
        { label: "Today's events", to: "/events" },
        { label: "Upcoming events", to: "/events" },
        { label: "My bookings", to: "/booking" }
      ]
    }
  ];

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <div className="hero-image-container">
          <img src="/images/hero.png" alt="People at an event" />
          <div className="hero-image-overlay">
            <h2>Find events near you</h2>
            <p>Browse events, check venues, and book seats online.</p>
          </div>
        </div>

        <section className="hero-section home-hero">
          <div className="hero-copy">
            <p className="section-tag">What's on</p>
            <h1>Browse events, book seats, and keep your tickets in one place.</h1>
            <p className="hero-text">
              Check today's events, look at upcoming plans, and book your seat in a few simple steps.
            </p>

            <div className="hero-actions">
              <Link className="primary-link" to="/events">
                View events
              </Link>
              <Link className="ghost-link" to="/venues">
                View venues
              </Link>
              <Link className="ghost-link" to="/auth">
                My account
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

            <div className="hero-browse-strip">
              {sortedEvents.slice(0, 3).map((event) => (
                <Link className="hero-mini-card" key={event.id} to={`/events/${event.id}`}>
                  <img src={getEventImage(event)} alt={event.title} />
                  <div>
                    <p>{formatDateLabel(event.date)}</p>
                    <strong>{event.title}</strong>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="spotlight-panel">
            <p className="search-eyebrow">Featured event</p>
            {spotlightEvent ? (
              <>
                <img
                  className="spotlight-image"
                  src={getEventImage(spotlightEvent)}
                  alt={spotlightEvent.title}
                />
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
              <p>The featured event will appear here after the event list loads.</p>
            )}
          </aside>
        </section>

        {error ? <p className="error-text">{error}</p> : null}

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading events...</p>
          </section>
        ) : null}

        {!isLoading ? (
          <>
            <section className="home-insight-grid">
              {whyChooseCards.map((card) => (
                <article className="home-insight-card" key={card.title}>
                  <p className="section-tag">Why use this site</p>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              ))}
            </section>

            <section className="home-split-section">
              <section className="simple-panel">
                <div className="section-head">
                  <p className="section-tag">Featured</p>
                  <h2>Events to check first</h2>
                </div>

                {featuredEvents.length ? (
                  <div className="home-feature-list">
                    {featuredEvents.map((event) => (
                      <Link className="home-feature-item" key={event.id} to={`/events/${event.id}`}>
                        <img src={getEventImage(event)} alt={event.title} />
                        <div className="home-feature-copy">
                          <p className="collection-kicker">{formatDateLabel(event.date)}</p>
                          <h3>{event.title}</h3>
                          <p>{event.city} | {event.venue}</p>
                          <strong>{event.price}</strong>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p>No featured events are available yet.</p>
                )}
              </section>

              <aside className="simple-panel home-plan-panel">
                <div className="section-head">
                  <p className="section-tag">Quick help</p>
                  <h2>How to use this page</h2>
                </div>

                <div className="home-plan-list">
                  <article>
                    <strong>Want an event for today?</strong>
                    <p>Start with today's events and move to seat booking from there.</p>
                  </article>
                  <article>
                    <strong>Planning ahead?</strong>
                    <p>Use the upcoming section and location section to compare options.</p>
                  </article>
                  <article>
                    <strong>Need tickets later?</strong>
                    <p>Create an account to keep your bookings and tickets saved.</p>
                  </article>
                </div>
              </aside>
            </section>

            <section className="featured-section">
              <div className="section-head">
                <p className="section-tag">Today</p>
                <h2>Today's events</h2>
              </div>

              {todayEvents.length ? (
                <div className="event-grid">
                  {todayEvents.map((event) => (
                    <article className="event-card" key={event.id}>
                      <div className="event-card-media">
                        <img
                          className="event-card-image"
                          src={getEventImage(event)}
                          alt={event.title}
                        />
                        <div className="event-card-media-overlay">
                          <span className="event-category-badge">{event.category}</span>
                          <p className="event-date">{formatDateLabel(event.date)}</p>
                        </div>
                      </div>
                      <div className="event-content">
                        <h3>{event.title}</h3>
                        <p>{event.city} | {event.venue}</p>
                        <p>{event.shortDescription}</p>
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
                <p className="section-tag">Categories</p>
                <h2>Browse by category</h2>
              </div>

              {categoryCards.length ? (
                <div className="home-category-grid">
                  {categoryCards.map((category) => (
                    <article className="home-category-card" key={category.name}>
                      <p className="collection-kicker">{category.name}</p>
                      <h3>{category.count} event{category.count === 1 ? "" : "s"}</h3>
                      <p>Next available: {formatDateLabel(category.nextDate)}</p>
                      <Link className="ghost-link" to={`/events?category=${encodeURIComponent(category.name)}`}>
                        Explore category
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <section className="simple-panel compact-panel">
                  <p>Categories will appear here once events are available.</p>
                </section>
              )}
            </section>

            <section className="collection-section">
              <div className="section-head">
                <p className="section-tag">Upcoming</p>
                <h2>Upcoming events</h2>
              </div>

              {upcomingEvents.length ? (
                <div className="collection-grid">
                  {upcomingEvents.map((event) => (
                    <article className="collection-card" key={event.id}>
                      <img
                        className="collection-card-image"
                        src={getEventImage(event)}
                        alt={event.title}
                      />
                      <div className="collection-card-body">
                        <p className="collection-kicker">{formatDateLabel(event.date)}</p>
                        <h3>{event.title}</h3>
                        <p>{event.city} | {event.venue}</p>
                        <p>{event.shortDescription}</p>
                        <div className="collection-meta-row">
                          <span>{event.category}</span>
                          <span>{event.price}</span>
                        </div>
                        <Link className="ghost-link" to={`/events/${event.id}`}>
                          Open details
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <section className="simple-panel compact-panel">
                  <p>No upcoming events are available right now.</p>
                </section>
              )}
            </section>

            <section className="collection-section">
              <div className="section-head">
                <p className="section-tag">Locations</p>
                <h2>Browse by location</h2>
              </div>
              {locationCards.length ? (
                <div className="collection-grid">
                  {locationCards.map((location) => (
                    <article className="collection-card" key={location.city}>
                      <div className="location-card-hero">
                        <p className="collection-kicker">{location.city}</p>
                        <h3>{location.count} event{location.count === 1 ? "" : "s"}</h3>
                      </div>
                      <div className="collection-card-body">
                        <p>Main venue: {location.venue}</p>
                        <Link className="ghost-link" to={`/events?city=${encodeURIComponent(location.city)}`}>
                          View city events
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <section className="simple-panel compact-panel">
                  <p>Locations will appear here once events are available.</p>
                </section>
              )}
            </section>
          </>
        ) : null}

        <footer className="site-footer">
          <div className="site-footer-grid">
            <section className="site-footer-brand">
              <p className="section-tag">EventHub</p>
              <h2>Simple event booking website</h2>
              <p>Browse events, check venues, and keep your bookings and tickets in one place.</p>
            </section>

            {footerLinks.map((group) => (
              <section className="site-footer-column" key={group.title}>
                <h3>{group.title}</h3>
                <div className="footer-links">
                  {group.links.map((link) => (
                    <Link key={link.label} to={link.to}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="site-footer-bottom">
            <p><strong>EventHub</strong> - Event booking and seat reservation</p>
            <div className="footer-links footer-links-inline">
              <Link to="/">Home</Link>
              <Link to="/events">Events</Link>
              <Link to="/venues">Venues</Link>
              <Link to="/auth">Account</Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default HomePage;
