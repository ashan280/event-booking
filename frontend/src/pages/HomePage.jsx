import { Link } from "react-router-dom";

const categories = [
  "Music",
  "Business",
  "Food",
  "Sports",
  "Workshops"
];

const featuredEvents = [
  {
    title: "Colombo Music Night",
    date: "Fri, 12 Apr",
    location: "Colombo",
    price: "LKR 2,500"
  },
  {
    title: "Startup Meetup 2026",
    date: "Sat, 20 Apr",
    location: "Kandy",
    price: "Free"
  },
  {
    title: "Food Festival Weekend",
    date: "Sun, 28 Apr",
    location: "Galle",
    price: "LKR 1,200"
  }
];

function HomePage({ modules }) {
  return (
    <main className="home-page">
      <header className="top-bar">
        <div className="brand-block">
          <p className="brand-name">EventHub</p>
          <span className="brand-subtitle">Student project base</span>
        </div>
        <nav className="top-links">
          <a href="#categories">Categories</a>
          <a href="#featured">Featured</a>
          <a href="#modules">Modules</a>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="section-tag">Event Booking and Seat Reservation System</p>
          <h1>Find your next event in a simple way</h1>
          <p>
            This base design is inspired by Eventbrite’s simple event discovery
            layout: search first, browse categories, then explore event cards.
          </p>
        </div>

        <div className="search-panel">
          <input type="text" placeholder="Search events" />
          <input type="text" placeholder="Location" />
          <button type="button">Search</button>
        </div>
      </section>

      <section className="category-section" id="categories">
        <div className="section-head">
          <p className="section-tag">Categories</p>
          <h2>Browse popular categories</h2>
        </div>
        <div className="category-list">
          {categories.map((category) => (
            <button className="category-chip" key={category} type="button">
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="featured-section" id="featured">
        <div className="section-head">
          <p className="section-tag">Featured Events</p>
          <h2>Simple event cards for the home page</h2>
        </div>
        <div className="event-grid">
          {featuredEvents.map((event) => (
            <article className="event-card" key={event.title}>
              <div className="event-image" />
              <div className="event-content">
                <p className="event-date">{event.date}</p>
                <h3>{event.title}</h3>
                <p>{event.location}</p>
                <strong>{event.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="module-section" id="modules">
        <div className="section-head">
          <p className="section-tag">Team Modules</p>
          <h2>Reserved areas for each member</h2>
        </div>
        <div className="module-grid">
        {modules.map((module) => (
          <article className="module-card" key={module.path}>
            <p className="module-label">{module.title}</p>
            <h2>{module.description}</h2>
            <Link className="primary-link" to={module.path}>
              Open module
            </Link>
          </article>
        ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
