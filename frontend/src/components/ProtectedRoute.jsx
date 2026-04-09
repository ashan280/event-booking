import { Navigate } from "react-router-dom";
import { getAuth } from "../lib/auth";

function ProtectedRoute({ children }) {
  const auth = getAuth();

  if (!auth?.token) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
