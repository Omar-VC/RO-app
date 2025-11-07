import { useNavigate } from "react-router-dom";
import { Users, CreditCard, Activity } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const tarjetaStyle = {
    backgroundColor: "var(--color-card)",
    border: "1px solid transparent",
    borderRadius: "1rem",
    padding: "1.5rem",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  };

  const handleHover = (e) => {
    e.currentTarget.style.transform = "translateY(-0.25rem)";
    e.currentTarget.style.boxShadow = "0 0 15px var(--color-dorado)";
    e.currentTarget.style.border = "1px solid var(--color-dorado)";
  };

  const handleLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "";
    e.currentTarget.style.border = "1px solid transparent";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-fondo)] text-[var(--color-texto)]">
      <h1 className="text-4xl font-bold mb-2 tracking-widest">
        Bienvenido a <span className="text-[var(--color-dorado)]">RO App</span>
      </h1>
      <p className="text-gray-300 mb-10 text-lg">
        Gestión de clientes y entrenamientos
      </p>

      <div className="flex gap-8 flex-wrap justify-center">
        {/* Clientes */}
        <div
          style={tarjetaStyle}
          onClick={() => navigate("/clientes")}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          <Users size={60} style={{ color: "var(--color-dorado)" }} className="mb-3" />
          <span className="text-lg font-semibold" style={{ color: "var(--color-texto)" }}>Clientes</span>
        </div>

        {/* Cuotas */}
        <div
          style={tarjetaStyle}
          onClick={() => navigate("/cuotas")}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          <CreditCard size={60} style={{ color: "var(--color-dorado)" }} className="mb-3" />
          <span className="text-lg font-semibold" style={{ color: "var(--color-texto)" }}>Cuotas</span>
        </div>

        {/* Progreso */}
        <div
          style={tarjetaStyle}
          onClick={() => navigate("/progreso")}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          <Activity size={60} style={{ color: "var(--color-dorado)" }} className="mb-3" />
          <span className="text-lg font-semibold" style={{ color: "var(--color-texto)" }}>Progreso</span>
        </div>
      </div>
    </div>
  );
}
