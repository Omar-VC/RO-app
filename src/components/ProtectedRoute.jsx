// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { currentUser } = useAuth();

  if (currentUser === undefined) return null; // Espera a que cargue

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifica un rol y no coincide
  if (role && currentUser.rol !== role) {
    // Redirigimos al home correcto según su rol
    if (currentUser.rol === "cliente") {
      return <Navigate to="/cliente/home" replace />;
    }
    if (currentUser.rol === "admin") {
      return <Navigate to="/" replace />;
    }

    // Si el rol no es ninguno de los esperados, mostramos mensaje
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>🚫 Acceso denegado</h1>
        <p>No tienes permisos para ver esta página.</p>
      </div>
    );
  }

  // Si el rol coincide, renderizamos el contenido protegido
  return children;
}
