import { Link } from "react-router-dom";

function PlaceholderPage({ title, description }) {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Module Base</p>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
        <Link className="primary-link" to="/">
          Back to home
        </Link>
      </section>
    </main>
  );
}

export default PlaceholderPage;
