import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function ProtectedRoute({ children }) {
  const auth = getAuth();
  const user = auth.currentUser;

  // Si no hay usuario logueado, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, renderizar el contenido protegido
  return children;
}
