import { Link } from "react-router-dom";

function PublicSiteHeader() {
  return (
    <header className="top-bar">
      <div className="brand-block">
        <Link className="brand-name" to="/">
          EventHub
        </Link>
        <span className="brand-subtitle">Find events, venues, and bookings in one place</span>
      </div>

      <nav className="top-links">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/venues">Venues</Link>
        <Link to="/booking">Booking</Link>
        <Link className="nav-cta" to="/auth">
          Account
        </Link>
      </nav>
    </header>
  );
}

export default PublicSiteHeader;
