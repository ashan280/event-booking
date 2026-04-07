function PageIntro({ eyebrow, title, description, actions, children }) {
  return (
    <section className="simple-panel page-intro">
      <div className="page-intro-main">
        <div className="page-intro-copy">
          {eyebrow ? <p className="section-tag">{eyebrow}</p> : null}
          <h1>{title}</h1>
          {description ? <p className="page-intro-text">{description}</p> : null}
        </div>

        {actions ? <div className="page-actions">{actions}</div> : null}
      </div>

      {children ? <div className="page-intro-extra">{children}</div> : null}
    </section>
  );
}

export default PageIntro;
