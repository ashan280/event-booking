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
    description: "Create a new account.",
    path: "/auth/register",
    style: "bg-white text-slate-900",
    textStyle: "text-slate-600"
  },
  {
    title: "Forgot Password",
    description: "Recover access to your account.",
    path: "/auth/forgot-password",
    style: "bg-white text-slate-900",
    textStyle: "text-slate-600"
  },
  {
    title: "Reset Password",
    description: "Set a new password.",
    path: "/auth/reset-password",
    style: "bg-white text-slate-900",
    textStyle: "text-slate-600"
  },
  {
    title: "Profile",
    description: "View your account details.",
    path: "/auth/profile",
    style: "bg-white text-slate-900",
    textStyle: "text-slate-600"
  },
  {
    title: "Reviews",
    description: "Add and read reviews.",
    path: "/auth/reviews",
    style: "bg-white text-slate-900",
    textStyle: "text-slate-600"
  }
];

const authSteps = [
  "Create an account",
  "Sign in with your email and password",
  "Open your profile",
  "Read and post reviews",
  "Recover or reset your password"
];

function AuthHomePage() {
  const auth = getAuth();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
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
                  Sign in, create an account, reset your password, and check your
                  profile and reviews here.
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
                    6 screens
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

            <aside className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm md:p-8">
              <p className="text-xs font-semibold text-orange-300">
                Current User
              </p>

              {auth?.fullName ? (
                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-3xl font-bold">{auth.fullName}</p>
                    <p className="mt-2 text-sm text-slate-300">{auth.email}</p>
                  </div>
                  <div className="grid gap-3 rounded-3xl border border-slate-700 bg-slate-800 p-4 text-sm text-slate-200">
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
                  <p className="text-3xl font-bold">Welcome back</p>
                  <p className="text-sm leading-6 text-slate-300">
                    No user is signed in right now. Use the links below to get started.
                  </p>
                  <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-800 p-4 text-sm text-slate-300">
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
              {authActions.map((action) => (
                <Link
                  className={`group rounded-3xl border border-slate-200 p-5 shadow-sm hover:bg-slate-50 ${action.style}`}
                  key={action.path}
                  to={action.path}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold">{action.title}</h3>
                    <span className="rounded-full border border-current/15 px-2 py-1 text-[11px] font-semibold opacity-70">
                      Open
                    </span>
                  </div>
                  <p className={`mt-3 text-sm leading-6 ${action.textStyle}`}>
                    {action.description}
                  </p>
                  <span className="mt-6 inline-flex text-sm font-semibold">
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

            <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
              <p className="text-xs font-semibold text-orange-300">
                Notes
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Simple account pages
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                All account pages use the same layout, so it is easier to move between
                login, profile, reviews, and password pages.
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthHomePage;
