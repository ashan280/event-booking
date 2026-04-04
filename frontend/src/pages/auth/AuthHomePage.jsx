import { Link } from "react-router-dom";
import { getAuth } from "../../lib/auth";

const authActions = [
  {
    title: "Login",
    description: "Sign in with email and password.",
    path: "/auth/login",
    style: "bg-slate-950 text-white",
    textStyle: "text-slate-300"
  },
  {
    title: "Register",
    description: "Create a new user account.",
    path: "/auth/register",
    style: "bg-white text-slate-900",
    textStyle: "text-slate-600"
  },
  {
    title: "Forgot Password",
    description: "Start the password recovery flow.",
    path: "/auth/forgot-password",
    style: "bg-white text-slate-900",
    textStyle: "text-slate-600"
  },
  {
    title: "Reset Password",
    description: "Update the password with a reset form.",
    path: "/auth/reset-password",
    style: "bg-white text-slate-900",
    textStyle: "text-slate-600"
  },
  {
    title: "Profile",
    description: "View account details and user info.",
    path: "/auth/profile",
    style: "bg-white text-slate-900",
    textStyle: "text-slate-600"
  },
  {
    title: "Reviews",
    description: "Add and read user reviews.",
    path: "/auth/reviews",
    style: "bg-white text-slate-900",
    textStyle: "text-slate-600"
  }
];

const authSteps = [
  "Register a new account",
  "Login with saved user data",
  "Open protected profile page",
  "Add and read reviews",
  "Use forgot and reset password pages"
];

function AuthHomePage() {
  const auth = getAuth();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_32%),linear-gradient(180deg,_#fffaf5_0%,_#f6f7fb_45%,_#eef3ff_100%)] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur">
          <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.4fr_0.9fr] md:px-10 md:py-10">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">
                Account Center
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
                  Authentication and user area for the real project.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                  Manage sign in, registration, password recovery, profile details, and reviews
                  from one clean account workspace.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Module
                  </p>
                  <strong className="mt-2 block text-2xl font-bold text-slate-950">
                    Auth
                  </strong>
                </article>
                <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Flow
                  </p>
                  <strong className="mt-2 block text-2xl font-bold text-slate-950">
                    6 Pages
                  </strong>
                </article>
                <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Status
                  </p>
                  <strong className="mt-2 block text-2xl font-bold text-slate-950">
                    Ready
                  </strong>
                </article>
              </div>
            </div>

            <aside className="rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.30)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
                Current User
              </p>

              {auth?.fullName ? (
                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-3xl font-black tracking-tight">{auth.fullName}</p>
                    <p className="mt-2 text-sm text-slate-300">{auth.email}</p>
                  </div>
                  <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                    <p><span className="font-semibold text-white">Role:</span> {auth.role}</p>
                    <p><span className="font-semibold text-white">Account:</span> Logged in</p>
                  </div>
                  <Link
                    className="inline-flex rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                    to="/auth/profile"
                  >
                    Open profile
                  </Link>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  <p className="text-3xl font-black tracking-tight">Welcome back</p>
                  <p className="text-sm leading-6 text-slate-300">
                    No user is signed in right now. Use the quick actions below to get started.
                  </p>
                  <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-300">
                    Sign in and create account pages are open. Profile and reviews stay protected.
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">
                  Quick Actions
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                  Main auth pages
                </h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Live pages
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {authActions.map((action) => (
                <Link
                  className={`group rounded-[24px] border border-slate-200 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${action.style}`}
                  key={action.path}
                  to={action.path}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold">{action.title}</h3>
                    <span className="rounded-full border border-current/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">
                      Open
                    </span>
                  </div>
                  <p className={`mt-3 text-sm leading-6 ${action.textStyle}`}>
                    {action.description}
                  </p>
                  <span className="mt-6 inline-flex text-sm font-semibold">
                    Go now
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">
                Workflow
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Current flow
              </h2>
              <div className="mt-5 space-y-3">
                {authSteps.map((step, index) => (
                  <div
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    key={step}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm font-medium text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] p-6 text-white shadow-[0_24px_60px_rgba(29,78,216,0.25)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-200">
                Project note
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Built as a real account experience
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                This account area now uses a cleaner dashboard layout and is ready for deeper
                password reset and user management logic.
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthHomePage;
