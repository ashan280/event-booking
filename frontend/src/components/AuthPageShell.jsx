import { Link, useLocation } from "react-router-dom";

function AuthPageShell({
  eyebrow,
  title,
  description,
  sideTitle,
  sideText,
  sideItems = [],
  children
}) {
  const location = useLocation();
  const backLink = location.pathname === "/auth"
    ? { to: "/", label: "Back to home" }
    : { to: "/auth", label: "Back to account" };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1300px] gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                to={backLink.to}
              >
                <span aria-hidden="true">{"<"}</span>
                <span>{backLink.label}</span>
              </Link>
            </div>

            <div className="inline-flex items-center rounded-full bg-orange-100 px-4 py-1 text-xs font-semibold text-orange-700">
              {eyebrow}
            </div>

            <div className="space-y-3">
              <h1 className="max-w-2xl text-3xl font-bold text-slate-950 md:text-4xl">
                {title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                {description}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 md:p-6">
              {children}
            </div>
          </div>
        </section>

        <aside className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm md:p-8">
          <div className="space-y-5">
            <p className="text-xs font-semibold text-orange-300">
              {sideTitle}
            </p>
            <h2 className="text-2xl font-bold md:text-3xl">
              {sideText}
            </h2>
            <div className="space-y-3">
              {sideItems.map((item, index) => (
                <div
                  className="flex items-start gap-3 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3"
                  key={item}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default AuthPageShell;
