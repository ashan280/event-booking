import { Navigate } from "react-router-dom";
import { getAuth } from "../lib/auth";

function GuestRoute({ children }) {
  const auth = getAuth();

  if (auth?.token) {
    return <Navigate to="/auth/profile" replace />;
  }

  return children;
}

export default GuestRoute;
