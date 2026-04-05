import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import { apiRequest } from "../../lib/api";

const categoryOptions = ["Music", "Business", "Food & Drink", "Workshops", "Sports"];

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

  function validateForm() {
    if (!formData.title.trim()) {
      return "Enter the event title";
    }

    if (!formData.category.trim()) {
      return "Select a category";
    }

    if (!formData.city.trim() || !formData.venue.trim()) {
      return "Enter the city and venue";
    }

    if (!formData.date.trim() || !formData.time.trim()) {
      return "Enter the date and time";
    }

    if (!formData.shortDescription.trim() || !formData.description.trim()) {
      return "Add a short description and full description";
    }

    if (Number(formData.availableSeats) < 1) {
      return "Seats must be at least 1";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const validationMessage = validateForm();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

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
        <PublicSiteHeader />

        <section className="simple-panel">
          <p className="section-tag">Create event</p>
          <h1>Add a new event.</h1>
          <p>Fill the form and save the event details.</p>

          <div className="auth-link-list">
            <Link className="ghost-link" to="/events">
              Back to events
            </Link>
          </div>

          <form className="event-form-grid" onSubmit={handleSubmit}>
            <label>
              Title
              <input
                name="title"
                placeholder="Ex: Colombo Music Night"
                value={formData.title}
                onChange={handleChange}
              />
            </label>
            <label>
              Category
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select category</option>
                {categoryOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Venue
              <input
                name="venue"
                placeholder="Ex: Lotus Hall"
                value={formData.venue}
                onChange={handleChange}
              />
            </label>
            <label>
              City
              <input
                name="city"
                placeholder="Ex: Colombo"
                value={formData.city}
                onChange={handleChange}
              />
            </label>
            <label>
              Date
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
            </label>
            <label>
              Time
              <input
                name="time"
                placeholder="Ex: 6:00 PM"
                value={formData.time}
                onChange={handleChange}
              />
            </label>
            <label>
              Price
              <input
                name="price"
                placeholder="Ex: LKR 1,500 or Free"
                value={formData.price}
                onChange={handleChange}
              />
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
                maxLength="120"
                placeholder="Write one short line about the event"
                value={formData.shortDescription}
                onChange={handleChange}
              />
              <span className="field-note">Keep this short and clear.</span>
            </label>
            <label className="event-form-full">
              Description
              <textarea
                className="auth-textarea"
                name="description"
                placeholder="Write the full event details"
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
