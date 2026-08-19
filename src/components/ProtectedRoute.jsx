import { Navigate } from "react-router-dom";
import { getLocalSession } from "../firebase/authService";

export default function ProtectedRoute({ children }) {
  const uid = getLocalSession();

  if (!uid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
