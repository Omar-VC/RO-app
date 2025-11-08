// src/components/Header.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="bg-[var(--color-principal)] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer hover:text-[var(--color-secundario)] transition-colors"
        >
          RO
        </div>

        {/* Navegación */}
        <nav className="flex space-x-6 text-sm md:text-base">
          <button
            onClick={() => navigate("/clientes")}
            className="hover:text-[var(--color-secundario)] transition-colors"
          >
            Clientes
          </button>
          <button
            onClick={() => navigate("/cuotas")}
            className="hover:text-[var(--color-secundario)] transition-colors"
          >
            Cuotas
          </button>
          <button
            onClick={() => navigate("/progreso")}
            className="hover:text-[var(--color-secundario)] transition-colors"
          >
            Progreso
          </button>
          <button
            onClick={handleLogout}
            className="bg-[var(--color-secundario)] text-white px-3 py-1 rounded-md hover:bg-[#8a283c] transition-colors"
          >
            Salir
          </button>
        </nav>
      </div>
    </header>
  );
}
