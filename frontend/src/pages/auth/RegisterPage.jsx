import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <main className="home-page">
      <section className="simple-panel auth-form-panel">
        <p className="section-tag">Member 1 Module</p>
        <h1>Register</h1>
        <p>This is the basic register page structure.</p>

        <form className="auth-form">
          <label>
            Full name
            <input type="text" placeholder="Enter your full name" />
          </label>

          <label>
            Email
            <input type="email" placeholder="Enter your email" />
          </label>

          <label>
            Password
            <input type="password" placeholder="Create a password" />
          </label>

          <button type="button" className="primary-link">
            Register
          </button>
        </form>

        <p className="helper-text">
          Already have an account? <Link to="/auth/login">Login here</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
