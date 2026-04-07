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

            <div className="account-side-list">
              {sideItems.map((item, index) => (
                <div className="account-side-item" key={item}>
                  <span className="account-side-number">
                    {index + 1}
                  </span>
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <div className="account-side-note">
              <p>
                {sideNote || "Use these pages to sign in, reset your password, and check your details."}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default AuthPageShell;
