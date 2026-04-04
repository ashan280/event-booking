import { Link } from "react-router-dom";

const categories = [
  "Music",
  "Business",
  "Food & Drink",
  "Arts",
  "Workshops",
  "Sports"
];

const quickFilters = ["Today", "This weekend", "Free", "Online", "Family-friendly"];

const featuredEvents = [
  {
    title: "Colombo Skyline Music Night",
    date: "Fri, 12 Apr",
    location: "Colombo Fort",
    price: "LKR 2,500",
    mood: "Live music"
  },
  {
    title: "Startup Sprint Summit 2026",
    date: "Sat, 20 Apr",
    location: "Kandy",
    price: "Free",
    mood: "Networking"
  },
  {
    title: "Southern Food Street Weekender",
    date: "Sun, 28 Apr",
    location: "Galle",
    price: "LKR 1,200",
    mood: "Festival"
  }
];

const collections = [
  {
    title: "Trending this week",
    description: "Popular events people are looking at right now."
  },
  {
    title: "Budget-friendly picks",
    description: "Easy-to-scan listings with clear pricing and location details."
  },
  {
    title: "Easy to book",
    description: "A smooth path from discovery to seat selection and checkout."
  }
];

const projectHighlights = [
  "Discover concerts, workshops, festivals, and more in one place",
  "Choose your event, reserve your seat, and book in a few simple steps",
  "Manage your account, bookings, and tickets with less effort"
];

function HomePage({ modules }) {
  return (
    <main className="home-page">
      <div className="page-shell">
        <header className="top-bar">
          <div className="brand-block">
            <p className="brand-name">EventHub</p>
            <span className="brand-subtitle">Event booking and seat reservation system</span>
          </div>

          <nav className="top-links">
            <a href="#discover">Discover</a>
            <a href="#featured">Featured</a>
            <a href="#modules">Explore</a>
            <Link className="nav-cta" to="/auth">
              Sign in
            </Link>
          </nav>
        </header>

        <section className="hero-section" id="discover">
          <div className="hero-copy">
            <p className="section-tag">Discover events</p>
            <h1>Discover events, reserve seats, and move smoothly into booking.</h1>
            <p className="hero-text">
              Find live events, explore by category, and move from browsing to booking
              in a simple, clear flow.
            </p>

            <div className="hero-actions">
              <button className="primary-link" type="button">
                Explore events
              </button>
              <Link className="ghost-link" to="/auth/register">
                Create account
              </Link>
            </div>

            <div className="hero-stats">
              <article>
                <strong>3</strong>
                <span>main platform areas</span>
              </article>
              <article>
                <strong>6</strong>
                <span>browse-first categories</span>
              </article>
              <article>
                <strong>1</strong>
                <span>end-to-end booking journey</span>
              </article>
            </div>
          </div>

          <aside className="search-panel">
            <p className="search-eyebrow">Find an event</p>
            <label>
              Looking for
              <input type="text" placeholder="Concerts, meetups, festivals..." />
            </label>
            <label>
              Location
              <input type="text" placeholder="Colombo, Kandy, Galle..." />
            </label>
            <label>
              Date
              <input type="text" placeholder="This weekend" />
            </label>
            <button type="button">Search events</button>
            <div className="quick-filter-list">
              {quickFilters.map((filter) => (
                <button className="quick-filter-chip" key={filter} type="button">
                  {filter}
                </button>
              ))}
            </div>
          </aside>
        </section>

        <section className="insight-strip">
          {projectHighlights.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </section>

        <section className="category-section" id="categories">
          <div className="section-head">
            <p className="section-tag">Browse</p>
            <h2>Popular categories to jump-start discovery</h2>
          </div>
          <div className="category-list">
            {categories.map((category) => (
              <button className="category-chip" key={category} type="button">
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="collection-section">
          <div className="section-head">
            <p className="section-tag">Collections</p>
            <h2>Fresh picks for different kinds of visitors</h2>
          </div>
          <div className="collection-grid">
            {collections.map((collection) => (
              <article className="collection-card" key={collection.title}>
                <p className="collection-kicker">Collection</p>
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="featured-section" id="featured">
          <div className="section-head">
            <p className="section-tag">Featured events</p>
            <h2>Featured events people can explore right away</h2>
          </div>
          <div className="event-grid">
            {featuredEvents.map((event) => (
              <article className="event-card" key={event.title}>
                <div className="event-image">
                  <span>{event.mood}</span>
                </div>
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
            <p className="section-tag">Explore</p>
            <h2>Key areas of the platform</h2>
          </div>
          <div className="module-grid">
            {modules.map((module) => (
              <article className="module-card" key={module.path}>
                <p className="module-label">{module.title}</p>
                <h3>{module.description}</h3>
                <p>{module.summary}</p>
                <Link className="primary-link" to={module.path}>
                  Open page
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default HomePage;
