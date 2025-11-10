import { useEffect, useState } from "react";
import { obtenerUsuariosPendientes, aprobarUsuario, rechazarUsuario } from "../firebase/usuarios";
import UIButton from "../components/UIButton";

export default function Aprobaciones() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarUsuarios = async () => {
    setCargando(true);
    const data = await obtenerUsuariosPendientes();
    setUsuarios(data);
    setCargando(false);
  };

  const handleAprobar = async (id) => {
    if (window.confirm("¿Aprobar este usuario?")) {
      await aprobarUsuario(id);
      alert("Usuario aprobado correctamente.");
      cargarUsuarios();
    }
  };

  const handleRechazar = async (id) => {
    if (window.confirm("¿Rechazar este usuario?")) {
      await rechazarUsuario(id);
      alert("Usuario rechazado.");
      cargarUsuarios();
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  if (cargando) return <div className="text-center mt-10">Cargando...</div>;

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: "var(--color-fondo)",
        color: "var(--color-texto)",
      }}
    >
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--color-dorado)" }}
      >
        Aprobaciones de Usuarios
      </h1>

      {usuarios.length === 0 ? (
        <p>No hay usuarios pendientes de aprobación.</p>
      ) : (
        <div className="grid gap-4">
          {usuarios.map((user) => (
            <div
              key={user.id}
              className="p-4 rounded-xl shadow-md border flex justify-between items-center"
              style={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-borde)",
              }}
            >
              <div>
                <p><strong>Nombre:</strong> {user.nombre}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Celular:</strong> {user.celular}</p>
              </div>
              <div className="flex gap-2">
                <UIButton variant="gold" onClick={() => handleAprobar(user.id)}>
                  Aprobar
                </UIButton>
                <UIButton variant="dark" onClick={() => handleRechazar(user.id)}>
                  Rechazar
                </UIButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
