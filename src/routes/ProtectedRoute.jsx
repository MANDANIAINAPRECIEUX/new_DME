import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { status } = useAuth();

  if (status === "loading") {
    return <div className="auth-loading">Chargement...</div>;
  }

  if (status === "signed-out") {
    return <Navigate to="/login" replace />;
  }

  if (status === "error") {
    return <div className="auth-loading">Impossible de contacter le serveur. Réessaie plus tard.</div>;
  }
  
  if (status === "not-authorized") {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}

export default ProtectedRoute;