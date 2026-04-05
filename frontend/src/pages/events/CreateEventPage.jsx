import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../lib/api";

function CreateEventPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    venue: "",
    city: "",
    date: "",
    time: "",
    price: "",
    shortDescription: "",
    description: "",
    availableSeats: "50"
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const data = await apiRequest("/api/events", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          availableSeats: Number(formData.availableSeats)
        })
      });

      navigate(`/events/${data.id}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="home-page">
      <div className="page-shell">
        <section className="simple-panel">
          <p className="section-tag">Create event</p>
          <h1>Add a new event.</h1>
          <p>Fill the form and save a simple event record for the event module.</p>

          <div className="auth-link-list">
            <Link className="ghost-link" to="/events">
              Back to events
            </Link>
          </div>

          <form className="event-form-grid" onSubmit={handleSubmit}>
            <label>
              Title
              <input name="title" value={formData.title} onChange={handleChange} />
            </label>
            <label>
              Category
              <input name="category" value={formData.category} onChange={handleChange} />
            </label>
            <label>
              Venue
              <input name="venue" value={formData.venue} onChange={handleChange} />
            </label>
            <label>
              City
              <input name="city" value={formData.city} onChange={handleChange} />
            </label>
            <label>
              Date
              <input name="date" placeholder="2026-05-20" value={formData.date} onChange={handleChange} />
            </label>
            <label>
              Time
              <input name="time" placeholder="6:00 PM" value={formData.time} onChange={handleChange} />
            </label>
            <label>
              Price
              <input name="price" placeholder="LKR 1,500" value={formData.price} onChange={handleChange} />
            </label>
            <label>
              Seats
              <input
                name="availableSeats"
                type="number"
                min="1"
                value={formData.availableSeats}
                onChange={handleChange}
              />
            </label>
            <label className="event-form-full">
              Short description
              <input
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
              />
            </label>
            <label className="event-form-full">
              Description
              <textarea
                className="auth-textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </label>

            <div className="event-form-full auth-link-list">
              <button className="primary-link" type="submit" disabled={isSaving}>
                {isSaving ? "Saving event..." : "Save event"}
              </button>
            </div>
          </form>

          {error ? <p className="error-text">{error}</p> : null}
        </section>
      </div>
    </main>
  );
}

export default CreateEventPage;
