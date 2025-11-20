import { Link } from "react-router-dom";

export default function ClienteHome() {
  return (
    <div className="min-h-screen bg-[var(--color-fondo)] text-[var(--color-texto)] p-6">
      <h1 className="text-3xl font-bold tracking-widest text-center mb-6">
        🏠 Home del Cliente
      </h1>

      <p className="text-lg text-center mb-10">
        Acceso rápido a tus secciones principales
      </p>

      {/* TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">

        {/* MI CUOTA */}
        <Link
          to="/cliente/cuota"
          className="bg-[var(--color-secundario)] text-[var(--color-fondo)] p-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-200"
        >
          <h2 className="text-xl font-bold mb-2">💰 Mi cuota</h2>
          <p>Ver estado, monto y detalle de tu cuota mensual.</p>
        </Link>

        {/* MI PROGRESO */}
        <Link
          to="/cliente/progreso"
          className="bg-[var(--color-secundario)] text-[var(--color-fondo)] p-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-200"
        >
          <h2 className="text-xl font-bold mb-2">📊 Mi progreso</h2>
          <p>Seguimiento físico, mediciones y rendimiento.</p>
        </Link>

        {/* MIS SESIONES */}
        <Link
          to="/cliente/sesiones"
          className="bg-[var(--color-secundario)] text-[var(--color-fondo)] p-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-200"
        >
          <h2 className="text-xl font-bold mb-2">📅 Mis sesiones</h2>
          <p>Historial de sesiones y entrenamientos enviados.</p>
        </Link>

      </div>
    </div>
  );
}
