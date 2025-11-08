// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (currentUser === undefined) return null; // Espera a que cargue el estado

  return currentUser ? children : <Navigate to="/login" replace />;
}
