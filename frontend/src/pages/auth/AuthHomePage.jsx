import { Link } from "react-router-dom";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import { getAuth, isAdmin } from "../../lib/auth";

const authActions = [
  {
    title: "Login",
    description: "Sign in with email and password.",
    path: "/auth/login"
  },
  {
    title: "Register",
    description: "Create a new account.",
    path: "/auth/register"
  },
  {
    title: "Forgot Password",
    description: "Recover access to your account.",
    path: "/auth/forgot-password"
  },
  {
    title: "Reset Password",
    description: "Set a new password.",
    path: "/auth/reset-password"
  },
  {
    title: "Profile",
    description: "View your account details.",
    path: "/auth/profile"
  },
  {
    title: "Reviews",
    description: "Add and read reviews.",
    path: "/auth/reviews"
  }
];

function AuthHomePage() {
  const auth = getAuth();
  const actions = [...authActions];
  const steps = [
    "Create an account",
    "Sign in with your email and password",
    "Open your profile",
    "Check your booking history",
    "Recover or reset your password"
  ];

  if (isAdmin(auth)) {
    steps.push("Open the admin dashboard to manage events");
  }

  if (auth?.token) {
    actions.push({
      title: "My Bookings",
      description: "Check the events you booked.",
      path: "/booking"
    });
  }

  if (isAdmin(auth)) {
    actions.push({
      title: "Admin Dashboard",
      description: "Manage events and check bookings.",
      path: "/admin"
    });
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1300px] space-y-6">
        <PublicSiteHeader />

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-6 px-6 py-8 md:px-9 md:py-9 lg:grid-cols-[1.16fr_0.84fr]">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  to="/"
                >
                  <span aria-hidden="true">{"<"}</span>
                  <span>Back to home</span>
                </Link>
              </div>

              <div className="inline-flex items-center rounded-full bg-orange-100 px-4 py-1 text-xs font-semibold text-orange-700">
                Account
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-3xl font-bold text-slate-950 md:text-5xl">
                  Manage your account in one place.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600">
                  Sign in, check your profile, review your booking history, and use the admin page if you manage events.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold text-slate-500">
                    Access
                  </p>
                  <strong className="mt-2 block text-xl font-bold text-slate-950">
                    Login and register
                  </strong>
                </article>
                <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold text-slate-500">
                    Pages
                  </p>
                  <strong className="mt-2 block text-xl font-bold text-slate-950">
                    {actions.length} screens
                  </strong>
                </article>
                <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold text-slate-500">
                    State
                  </p>
                  <strong className="mt-2 block text-xl font-bold text-slate-950">
                    Ready
                  </strong>
                </article>
              </div>
            </div>

            <aside className="rounded-3xl border border-orange-100 bg-[#fff5ef] p-6 text-slate-900 shadow-sm md:p-8">
              <p className="text-xs font-semibold text-orange-700">
                Current User
              </p>

              {auth?.fullName ? (
                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-3xl font-bold">{auth.fullName}</p>
                    <p className="mt-2 text-sm text-slate-600">{auth.email}</p>
                  </div>
                  <div className="grid gap-3 rounded-3xl border border-orange-100 bg-white p-4 text-sm text-slate-600">
                    <p><span className="font-semibold text-slate-900">Role:</span> {auth.role}</p>
                    <p><span className="font-semibold text-slate-900">Account:</span> Logged in</p>
                  </div>
                  <Link
                    className="inline-flex rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                    to="/auth/profile"
                  >
                    Open profile
                  </Link>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  <p className="text-3xl font-bold">Welcome back</p>
                  <p className="text-sm leading-6 text-slate-600">
                    No user is signed in right now. Use the links below to get started.
                  </p>
                  <div className="rounded-3xl border border-dashed border-orange-200 bg-white p-4 text-sm text-slate-600">
                    Login and register are open. Profile and reviews need sign in.
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.14fr_0.86fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-orange-700">
                  Pages
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  Account pages
                </h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Open
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {actions.map((action) => (
                <Link
                  className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:bg-slate-50"
                  key={action.path}
                  to={action.path}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-slate-950">{action.title}</h3>
                    <span className="rounded-full border border-current/15 px-2 py-1 text-[11px] font-semibold opacity-70">
                      Open
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {action.description}
                  </p>
                  <span className="mt-6 inline-flex text-sm font-semibold text-orange-700">
                    Open page
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold text-orange-700">
                Steps
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                How it works
              </h2>
              <div className="mt-5 space-y-3">
                {steps.map((step, index) => (
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

            <section className="rounded-3xl border border-orange-100 bg-[#fff5ef] p-6 text-slate-900 shadow-sm">
              <p className="text-xs font-semibold text-orange-700">
                Notes
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Simple account pages
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Account pages now connect with bookings and the admin side, so the flow is easier to follow.
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthHomePage;
