import { Route, Routes } from "react-router-dom";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AuthHomePage from "./pages/auth/AuthHomePage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProfilePage from "./pages/auth/ProfilePage";
import ReviewPage from "./pages/auth/ReviewPage";
import EventDetailsPage from "./pages/events/EventDetailsPage";
import EventsPage from "./pages/events/EventsPage";
import VenuesPage from "./pages/events/VenuesPage";
import PlaceholderPage from "./pages/PlaceholderPage";

const modules = [
  {
    title: "Accounts",
    path: "/auth",
    description: "Login, account settings, and reviews",
    summary: "Sign in, register, open protected pages, and manage reviews"
  },
  {
    title: "Events",
    path: "/events",
    description: "Event discovery, categories, venues, and search",
    summary: "Browse pages, filters, event details, and management tools"
  },
  {
    title: "Bookings",
    path: "/booking",
    description: "Bookings, seats, payments, tickets, and reports",
    summary: "Seat maps, checkout, payment flow, tickets, and booking history"
  }
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage modules={modules} />} />
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
        path="/events/:eventId"
        element={<EventDetailsPage />}
      />
      <Route
        path="/venues"
        element={<VenuesPage />}
      />
      <Route
        path="/booking"
        element={
          <PlaceholderPage
            title="Bookings"
            description="Seat selection, checkout, and ticket pages will appear here."
          />
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
