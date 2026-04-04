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
import PlaceholderPage from "./pages/PlaceholderPage";

const modules = [
  {
    title: "Member 1",
    path: "/auth",
    description: "Authentication, user management, reviews",
    summary: "Login, register, protected routes, profiles, ratings"
  },
  {
    title: "Member 2",
    path: "/events",
    description: "Events, categories, venues, search",
    summary: "Discovery pages, filters, event detail screens, admin event tools"
  },
  {
    title: "Member 3",
    path: "/booking",
    description: "Booking, seats, payments, tickets, reports",
    summary: "Seat maps, checkout, payment flow, tickets, booking analytics"
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
        element={
          <PlaceholderPage
            title="Events Module"
            description="Base route reserved for Member 2."
          />
        }
      />
      <Route
        path="/booking"
        element={
          <PlaceholderPage
            title="Booking Module"
            description="Base route reserved for Member 3."
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
