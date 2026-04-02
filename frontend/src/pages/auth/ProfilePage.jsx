import { Link } from "react-router-dom";

function ProfilePage() {
  return (
    <main className="home-page">
      <section className="simple-panel">
        <p className="section-tag">Member 1 Module</p>
        <h1>User Profile</h1>
        <p>This page will later show user details, booking history, and reviews.</p>

        <div className="profile-box">
          <p><strong>Name:</strong> Sample User</p>
          <p><strong>Email:</strong> sampleuser@email.com</p>
          <p><strong>Role:</strong> USER</p>
        </div>

        <Link className="primary-link" to="/auth">
          Back to auth home
        </Link>
      </section>
    </main>
  );
}

export default ProfilePage;
