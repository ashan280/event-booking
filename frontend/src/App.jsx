import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlaceholderPage from "./pages/PlaceholderPage";

const modules = [
  {
    title: "Member 1",
    path: "/auth",
    description: "Authentication, user management, reviews"
  },
  {
    title: "Member 2",
    path: "/events",
    description: "Events, categories, venues, search"
  },
  {
    title: "Member 3",
    path: "/booking",
    description: "Booking, seats, payments, tickets, reports"
  }
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage modules={modules} />} />
      <Route
        path="/auth"
        element={
          <PlaceholderPage
            title="Auth Module"
            description="Base route reserved for Member 1."
          />
        }
      />
      <Route
        path="/events"
        element={
          <PlaceholderPage
            title="Events Module"
            description="Base route reserved for Member 2."
          />
        }
      />
      <Route
        path="/booking"
        element={
          <PlaceholderPage
            title="Booking Module"
            description="Base route reserved for Member 3."
          />
        }
      />
      <Route
        path="*"
        element={
          <main className="page-shell">
            <section className="hero-card">
              <p className="eyebrow">Event Booking System</p>
              <h1>Page not found</h1>
              <p className="lead">
                The route does not exist yet. Return to the project home page.
              </p>
              <Link className="primary-link" to="/">
                Back to home
              </Link>
            </section>
          </main>
        }
      />
    </Routes>
  );
}

export default App;
