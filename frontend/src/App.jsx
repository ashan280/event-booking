import { Route, Routes } from "react-router-dom";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminBookingReportPage from "./pages/admin/AdminBookingReportPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import BookingHistoryPage from "./pages/booking/BookingHistoryPage";
import BookingPage from "./pages/booking/BookingPage";
import PaymentPage from "./pages/booking/PaymentPage";
import TicketPage from "./pages/booking/TicketPage";
import HomePage from "./pages/HomePage";
import AuthHomePage from "./pages/auth/AuthHomePage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProfilePage from "./pages/auth/ProfilePage";
import ReviewPage from "./pages/auth/ReviewPage";
import CreateEventPage from "./pages/events/CreateEventPage";
import EditEventPage from "./pages/events/EditEventPage";
import EventDetailsPage from "./pages/events/EventDetailsPage";
import EventsPage from "./pages/events/EventsPage";
import VenueDetailsPage from "./pages/events/VenueDetailsPage";
import VenuesPage from "./pages/events/VenuesPage";
import PlaceholderPage from "./pages/PlaceholderPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/auth"
        element={<AuthHomePage />}
      />
      <Route
        path="/auth/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/auth/forgot-password"
        element={
          <GuestRoute>
            <ForgotPasswordPage />
          </GuestRoute>
        }
      />
      <Route
        path="/auth/reset-password"
        element={
          <GuestRoute>
            <ResetPasswordPage />
          </GuestRoute>
        }
      />
      <Route
        path="/auth/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route
        path="/auth/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/auth/reviews"
        element={
          <ProtectedRoute>
            <ReviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={<EventsPage />}
      />
      <Route
        path="/events/create"
        element={
          <ProtectedRoute>
            <CreateEventPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:eventId/edit"
        element={
          <ProtectedRoute>
            <EditEventPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:eventId"
        element={<EventDetailsPage />}
      />
      <Route
        path="/venues"
        element={<VenuesPage />}
      />
      <Route
        path="/venues/:city/:venueName"
        element={<VenueDetailsPage />}
      />
      <Route
        path="/booking"
        element={
          <ProtectedRoute>
            <BookingHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/:eventId"
        element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/:eventId/payment"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/tickets/:bookingId"
        element={
          <ProtectedRoute>
            <TicketPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute>
            <AdminBookingReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <PlaceholderPage
            title="Page not found"
            description="This page is not ready yet. Go back and continue from the home page."
          />
        }
      />
    </Routes>
  );
}

export default App;
