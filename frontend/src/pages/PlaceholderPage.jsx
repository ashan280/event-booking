import { Link } from "react-router-dom";

function PlaceholderPage({ title, description }) {
  return (
    <main className="home-page">
      <section className="simple-panel">
        <p className="section-tag">Module Base</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link className="primary-link" to="/">
          Back to home
        </Link>
      </section>
    </main>
  );
}

export default PlaceholderPage;
