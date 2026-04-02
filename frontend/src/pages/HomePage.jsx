import { Link } from "react-router-dom";

function HomePage({ modules }) {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Event Booking and Seat Reservation System</p>
        <h1>Shared base project</h1>
        <p className="lead">
          This starter frontend gives the team a common layout, routing
          structure, and reserved module areas before feature work begins.
        </p>
      </section>

      <section className="module-grid">
        {modules.map((module) => (
          <article className="module-card" key={module.path}>
            <p className="module-label">{module.title}</p>
            <h2>{module.description}</h2>
            <Link className="primary-link" to={module.path}>
              Open module
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

export default HomePage;
