import { Link } from "react-router-dom";
import PageIntro from "../components/PageIntro";
import PublicSiteHeader from "../components/PublicSiteHeader";

function PlaceholderPage({ title, description }) {
  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <PageIntro
          eyebrow="Coming soon"
          title={title}
          description={description}
          actions={(
            <Link className="primary-link" to="/">
              Back to home
            </Link>
          )}
        />
      </div>
    </main>
  );
}

export default PlaceholderPage;
