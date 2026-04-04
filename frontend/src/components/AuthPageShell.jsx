function AuthPageShell({
  eyebrow,
  title,
  description,
  sideTitle,
  sideText,
  sideItems = [],
  children
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_28%),linear-gradient(180deg,_#fffaf5_0%,_#f4f7fb_45%,_#edf3ff_100%)] px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-between rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur md:p-10">
          <div className="space-y-5">
            <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">
              {eyebrow}
            </div>

            <div className="space-y-3">
              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                {title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                {description}
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/85 p-4 shadow-sm md:p-6">
              {children}
            </div>
          </div>
        </section>

        <aside className="rounded-[32px] bg-[linear-gradient(160deg,#0f172a_0%,#1d4ed8_100%)] p-6 text-white shadow-[0_24px_60px_rgba(29,78,216,0.24)] md:p-8">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-200">
              {sideTitle}
            </p>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              {sideText}
            </h2>
            <div className="space-y-3">
              {sideItems.map((item, index) => (
                <div
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3"
                  key={item}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/16 text-xs font-bold text-white">
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
