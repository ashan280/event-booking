import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import { apiRequest } from "../../lib/api";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      setIsLoading(true);
      setError("");

      try {
        const data = await apiRequest("/api/events/categories");
        setCategories(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <section className="simple-panel">
          <p className="section-tag">Categories</p>
          <h1>Browse event categories.</h1>
          <p>Open a category and go to the event list with that filter already selected.</p>

          <div className="auth-link-list">
            <Link className="ghost-link" to="/events">
              Back to events
            </Link>
            <Link className="ghost-link" to="/venues">
              View venues
            </Link>
          </div>
        </section>

        {error ? <p className="error-text">{error}</p> : null}

        {isLoading ? (
          <section className="simple-panel">
            <p>Loading categories...</p>
          </section>
        ) : null}

        {!isLoading && categories.length ? (
          <section className="category-page-grid">
            {categories.map((category) => (
              <article className="event-list-card" key={category.name}>
                <p className="section-tag">Category</p>
                <h2>{category.name}</h2>
                <p>{category.eventCount} event{category.eventCount === 1 ? "" : "s"} in this category.</p>
                <Link
                  className="primary-link"
                  to={`/events?category=${encodeURIComponent(category.name)}`}
                >
                  View events
                </Link>
              </article>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default CategoriesPage;
