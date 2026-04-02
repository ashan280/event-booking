import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <main className="home-page">
      <section className="simple-panel auth-form-panel">
        <p className="section-tag">Member 1 Module</p>
        <h1>Login</h1>
        <p>This is the basic login page structure.</p>

        <form className="auth-form">
          <label>
            Email
            <input type="email" placeholder="Enter your email" />
          </label>

          <label>
            Password
            <input type="password" placeholder="Enter your password" />
          </label>

          <button type="button" className="primary-link">
            Login
          </button>
        </form>

        <p className="helper-text">
          New user? <Link to="/auth/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
