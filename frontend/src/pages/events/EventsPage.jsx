import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiRequest } from "../../lib/api";

function getEventTheme(category) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [cities, setCities] = useState(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [city, setCity] = useState(searchParams.get("city") || "All");

  useEffect(() => {
    async function loadFilters() {
      try {
        const [categoryData, cityData] = await Promise.all([
          apiRequest("/api/events/categories"),
          apiRequest("/api/events/cities")
        ]);

        setCategories(["All", ...categoryData.map((item) => item.name)]);
        setCities(["All", ...cityData.map((item) => item.name)]);
      } catch {
        setCategories(["All"]);
        setCities(["All"]);
      }
    }

    loadFilters();
  }, []);

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (category !== "All") {
        params.set("category", category);
      }

      if (city !== "All") {
        params.set("city", city);
      }

      setSearchParams(params, { replace: true });

      try {
        const query = params.toString();
        const data = await apiRequest(`/api/events${query ? `?${query}` : ""}`);
        setEvents(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, [search, category, city, setSearchParams]);

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setCity("All");
  }

  return (
    <main className="home-page">
      <div className="page-shell">
        <section className="events-page-header simple-panel">
          <p className="section-tag">Events</p>
          <h1>Browse available events.</h1>
          <p>
            Search events, filter by category, and open each event page to see
            the details.
          </p>

          <div className="events-filter-grid">
            <label>
              Search
              <input
                type="text"
                placeholder="Search by title, city, or venue"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <label>
              Category
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              City
              <select value={city} onChange={(event) => setCity(event.target.value)}>
                {cities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="auth-link-list">
            <Link className="ghost-link" to="/">
              Back to home
            </Link>
            <Link className="ghost-link" to="/categories">
              View categories
            </Link>
            <Link className="ghost-link" to="/venues">
              View venues
            </Link>
            <Link className="ghost-link" to="/events/create">
              Add event
            </Link>
            <button className="ghost-link" type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        </section>

        {error ? <p className="error-text">{error}</p> : null}

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading events...</p>
          </section>
        ) : null}

        {!isLoading && !events.length ? (
          <section className="simple-panel">
            <p>No events found for this filter.</p>
          </section>
        ) : null}

        {!isLoading && events.length ? (
          <section className="event-list-grid">
            {events.map((event) => (
              <article className="event-list-card" key={event.id}>
                <div className={`event-list-image event-theme-${getEventTheme(event.category)}`}>
                  <span className="event-image-badge">{event.category}</span>
                  <div className="event-image-text">
                    <strong>{event.city}</strong>
                    <span>{event.date}</span>
                  </div>
                </div>

                <div className="event-list-body">
                  <h2>{event.title}</h2>
                  <p className="event-summary-text">{event.shortDescription}</p>
                  <div className="event-meta-grid">
                    <span>{event.date}</span>
                    <span>{event.time}</span>
                    <span>{event.city}</span>
                    <span>{event.price}</span>
                  </div>
                  <p className="event-venue-text">
                    {event.venue} | {event.availableSeats} seats left
                  </p>
                  <Link className="primary-link" to={`/events/${event.id}`}>
                    View details
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

export default EventsPage;
