import { Navigate } from "react-router-dom";
import { getAuth, isAdmin } from "../lib/auth";

function AdminRoute({ children }) {
  const auth = getAuth();

  if (!auth?.token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!isAdmin(auth)) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default AdminRoute;
