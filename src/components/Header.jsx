import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const userData = JSON.parse(localStorage.getItem("userData"));

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  console.log("Rol del usuario:", userData?.rol);


  return (
    <header
      className="text-white shadow-md sticky top-0 z-50"
      style={{
        backgroundColor: "var(--color-header)",
      }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer hover:text-[var(--color-secundario)] transition-colors"
        >
          R O
        </div>

        <div className="flex items-center gap-6">
          {/* 🔥 Solo visible para el admin */}
          {userData?.rol === "admin" && (
            <Link
              to="/aprobaciones"
              className="text-[var(--color-dorado)] font-semibold hover:underline"
            >
              Aprobaciones
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="bg-[var(--color-secundario)] text-white px-3 py-1 rounded-md hover:bg-[#8a283c] transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
