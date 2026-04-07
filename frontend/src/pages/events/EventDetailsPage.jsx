import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageIntro from "../../components/PageIntro";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import { apiRequest } from "../../lib/api";
import { getAuth, isAdmin } from "../../lib/auth";

function getEventTheme(category) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function EventDetailsPage() {
  const navigate = useNavigate();
  const auth = getAuth();
  const canManageEvents = isAdmin(auth);
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      setIsLoading(true);
      setError("");

      try {
        const data = await apiRequest(`/api/events/${eventId}`);
        setEvent(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  async function handleDelete() {
    const confirmed = window.confirm("Do you want to delete this event?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await apiRequest(`/api/events/${eventId}`, {
        method: "DELETE",
        auth: true
      });

      navigate("/events");
    } catch (requestError) {
      setError(requestError.message);
      setIsDeleting(false);
    }
  }

  return (
    <main className="home-page">
      <div className="page-shell">
        <PublicSiteHeader />

        {event ? (
          <PageIntro
            eyebrow={event.category}
            title={event.title}
            description={event.shortDescription}
            actions={(
              <>
                <Link className="ghost-link" to="/events">
                  Back to events
                </Link>
                {canManageEvents ? (
                  <Link className="ghost-link" to="/events/create">
                    Add event
                  </Link>
                ) : null}
                {canManageEvents ? (
                  <Link className="ghost-link" to={`/events/${event.id}/edit`}>
                    Edit event
                  </Link>
                ) : null}
              </>
            )}
          />
        ) : null}

        {isLoading ? <section className="simple-panel"><p>Loading event details...</p></section> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {event ? (
          <section className="event-details-layout">
            <div className="event-details-main">
              <div className={`event-details-image simple-event-image event-theme-${getEventTheme(event.category)}`}>
                <span className="event-image-badge">{event.category}</span>
              </div>

              <div className="event-details-box">
                <h2>About this event</h2>
                <p>{event.description}</p>
              </div>

              <div className="event-details-box">
                <h2>Event details</h2>
                <div className="event-meta-grid">
                  <span>Date: {event.date}</span>
                  <span>Time: {event.time}</span>
                  <span>City: {event.city}</span>
                  <span>Venue: {event.venue}</span>
                </div>
              </div>
            </div>

            <aside className="event-details-side">
              <div className="event-details-box">
                <h2>Book this event</h2>
                <p>Price: {event.price}</p>
                <p>Seats left: {event.availableSeats}</p>
                <Link className="primary-link" to={`/booking/${event.id}`}>
                  Book now
                </Link>
              </div>

              {canManageEvents ? (
                <div className="event-details-box">
                  <h2>Manage event</h2>
                  <p>You can edit this event or remove it from the event list.</p>
                  <div className="auth-link-list">
                    <Link className="ghost-link" to={`/events/${event.id}/edit`}>
                      Edit event
                    </Link>
                    <button
                      className="ghost-link delete-link"
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete event"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="event-details-box">
                  <h2>Admin</h2>
                  <p>Admins can update this event from the admin page.</p>
                </div>
              )}
            </aside>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default EventDetailsPage;
