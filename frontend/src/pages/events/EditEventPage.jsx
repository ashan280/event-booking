import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../../lib/api";

function EditEventPage() {
  const navigate = useNavigate();
  const { eventId } = useParams();
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      setIsLoading(true);
      setError("");

      try {
        const data = await apiRequest(`/api/events/${eventId}`);
        setFormData({
          title: data.title,
          category: data.category,
          venue: data.venue,
          city: data.city,
          date: data.date,
          time: data.time,
          price: data.price,
          shortDescription: data.shortDescription,
          description: data.description,
          availableSeats: String(data.availableSeats)
        });
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

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
      await apiRequest(`/api/events/${eventId}`, {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          availableSeats: Number(formData.availableSeats)
        })
      });

      navigate(`/events/${eventId}`);
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
          <p className="section-tag">Edit event</p>
          <h1>Update event details.</h1>
          <p>Change the event information and save the updated record.</p>

          <div className="auth-link-list">
            <Link className="ghost-link" to="/events">
              Back to events
            </Link>
            <Link className="ghost-link" to={`/events/${eventId}`}>
              Back to details
            </Link>
          </div>

          {isLoading ? <p>Loading event...</p> : null}

          {!isLoading ? (
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
                <input name="date" value={formData.date} onChange={handleChange} />
              </label>
              <label>
                Time
                <input name="time" value={formData.time} onChange={handleChange} />
              </label>
              <label>
                Price
                <input name="price" value={formData.price} onChange={handleChange} />
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
                  {isSaving ? "Saving changes..." : "Save changes"}
                </button>
              </div>
            </form>
          ) : null}

          {error ? <p className="error-text">{error}</p> : null}
        </section>
      </div>
    </main>
  );
}

export default EditEventPage;
