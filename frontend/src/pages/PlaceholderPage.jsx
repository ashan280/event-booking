import { Link } from "react-router-dom";
import PublicSiteHeader from "../components/PublicSiteHeader";

function PlaceholderPage({ title, description }) {
  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <section className="simple-panel">
          <p className="section-tag">Coming soon</p>
          <h1>{title}</h1>
          <p>{description}</p>
          <Link className="primary-link" to="/">
            Back to home
          </Link>
        </section>
      </div>
    </main>
  );
}

export default PlaceholderPage;
