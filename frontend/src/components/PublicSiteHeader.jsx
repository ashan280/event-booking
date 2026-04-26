import { Link } from "react-router-dom";
import { getAuth, isAdmin, isLoggedIn } from "../lib/auth";

function PublicSiteHeader() {
  const auth = getAuth();

  return (
    <header className="top-bar">
      <div className="brand-block">
        <Link className="brand-name" to="/">
          EventHub
        </Link>
        <span className="brand-subtitle">Find good events, book faster, and keep every ticket in one place</span>
      </div>

      <nav className="top-links">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/venues">Venues</Link>
        {isLoggedIn(auth) ? (
          <Link to="/booking">My bookings</Link>
        ) : null}
        {isAdmin(auth) ? (
          <Link to="/admin">Admin</Link>
        ) : null}
        <Link className="nav-cta" to={isLoggedIn(auth) ? "/auth" : "/auth/login"}>
          {isLoggedIn(auth) ? "My account" : "Sign in"}
        </Link>
      </nav>
    </header>
  );
}

export default PublicSiteHeader;
