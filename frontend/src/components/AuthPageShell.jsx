import { Link, useLocation } from "react-router-dom";
import PublicSiteHeader from "./PublicSiteHeader";

function AuthPageShell({
  eyebrow,
  title,
  description,
  sideTitle,
  sideText,
  sideItems = [],
  sideNote,
  children
}) {
  const location = useLocation();
  const backLink = location.pathname === "/auth"
    ? { to: "/", label: "Back to home" }
    : { to: "/auth", label: "Back to account" };

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        <div className="account-layout">
          <section className="account-main">
            <div className="page-actions">
              <Link className="ghost-link" to={backLink.to}>
                {backLink.label}
              </Link>
            </div>

            <div className="account-badge">
              {eyebrow}
            </div>

            <div className="account-heading">
              <h1>{title}</h1>
              <p>{description}</p>
            </div>

            <div className="account-content">
              {children}
            </div>
          </section>

          <aside className="account-side">
            <div className="account-side-head">
              <p className="section-tag">{sideTitle}</p>
              <h2>{sideText}</h2>
            </div>

            <div className="auth-side-card-grid">
              {sideItems.map((item, index) => {
                const card = typeof item === "string"
                  ? { title: `Info ${index + 1}`, text: item }
                  : item;

                return (
                  <article className="auth-side-card" key={`${card.title}-${index}`}>
                    {card.tag ? <p className="section-tag">{card.tag}</p> : null}
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                    {card.link && card.label ? (
                      <Link className="ghost-link" to={card.link}>
                        {card.label}
                      </Link>
                    ) : null}
                  </article>
                );
              })}
            </div>

            <div className="account-side-note">
              <p>
                {sideNote || "Use your account to book events, save tickets, and check your booking history later."}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default AuthPageShell;
