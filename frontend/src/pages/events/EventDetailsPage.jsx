import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageIntro from "../../components/PageIntro";
import PublicSiteHeader from "../../components/PublicSiteHeader";
import { apiRequest } from "../../lib/api";
import { getAuth, isAdmin } from "../../lib/auth";

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
              <div className="event-details-image simple-event-image">
                <img
                  className="event-details-photo"
                  src={event.imageUrl || "/images/concert.png"}
                  alt={event.title}
                />
                <span className="event-image-badge">{event.category}</span>
              </div>

              <div className="event-details-box">
                <p className="section-tag">About this event</p>
                <h2 className="panel-title">Event overview</h2>
                <p>{event.description}</p>
              </div>

              <div className="event-details-box">
                <p className="section-tag">Details</p>
                <h2 className="panel-title">Event information</h2>
                <div className="booking-detail-grid">
                  <article className="booking-detail-card">
                    <span className="booking-detail-label">Date</span>
                    <strong className="booking-detail-value">{event.date}</strong>
                  </article>
                  <article className="booking-detail-card">
                    <span className="booking-detail-label">Time</span>
                    <strong className="booking-detail-value">{event.time}</strong>
                  </article>
                  <article className="booking-detail-card">
                    <span className="booking-detail-label">City</span>
                    <strong className="booking-detail-value">{event.city}</strong>
                  </article>
                  <article className="booking-detail-card">
                    <span className="booking-detail-label">Venue</span>
                    <strong className="booking-detail-value">{event.venue}</strong>
                  </article>
                  <article className="booking-detail-card">
                    <span className="booking-detail-label">Price</span>
                    <strong className="booking-detail-value">{event.price}</strong>
                  </article>
                  <article className="booking-detail-card">
                    <span className="booking-detail-label">Seats left</span>
                    <strong className="booking-detail-value">{event.availableSeats}</strong>
                  </article>
                </div>
              </div>
            </div>

            <aside className="event-details-side">
              <div className="event-details-box">
                <p className="section-tag">Booking</p>
                <h2 className="panel-title">Book this event</h2>
                <div className="booking-quick-grid">
                  <div className="booking-total-box">
                    <p>Price</p>
                    <strong>{event.price}</strong>
                  </div>
                  <div className="booking-total-box">
                    <p>Seats left</p>
                    <strong>{event.availableSeats}</strong>
                  </div>
                </div>
                <div className="booking-note-box">
                  <strong>Before you continue</strong>
                  <p>Sign in first if you want to book this event and save your ticket.</p>
                </div>
                <Link className="primary-link" to={`/booking/${event.id}`}>
                  Book now
                </Link>
              </div>

              {canManageEvents ? (
                <div className="event-details-box">
                  <p className="section-tag">Manage</p>
                  <h2 className="panel-title">Manage event</h2>
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
                  <p className="section-tag">Admin</p>
                  <h2 className="panel-title">Event updates</h2>
                  <p>Admins can update this event from the admin dashboard.</p>
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
