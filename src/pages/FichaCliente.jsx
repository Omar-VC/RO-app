import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UIButton from "../components/UIButton";
import { obtenerClientePorId, editarCliente, eliminarCliente } from "../firebase/clientes";

export default function FichaCliente({ actualizarListaClientes }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    async function cargarCliente() {
      const data = await obtenerClientePorId(id);
      if (data) setCliente(data);
      else navigate("/clientes");
    }
    cargarCliente();
  }, [id, navigate]);

  if (!cliente) {
    return (
      <div className="p-6 text-[var(--color-texto)]">
        Cargando cliente...
      </div>
    );
  }

  const handleChange = (field, value) => {
    setCliente((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardar = async () => {
    await editarCliente(id, cliente);
    setEditando(false);
    alert("Cliente actualizado correctamente");
    if (actualizarListaClientes) actualizarListaClientes();
  };

  const handleEliminar = async () => {
    if (window.confirm("¿Estás seguro que querés eliminar este cliente?")) {
      await eliminarCliente(id);
      alert("Cliente eliminado correctamente");
      if (actualizarListaClientes) actualizarListaClientes();
      navigate("/clientes");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[var(--color-fondo)] text-[var(--color-texto)]">
      <div className="max-w-md mx-auto bg-[var(--color-card)] p-6 rounded-xl shadow-md space-y-4">

        <div
          className="text-2xl font-bold text-center mb-4"
          style={{ color: "var(--color-dorado)" }}
        >
          Ficha del Cliente
        </div>

        {/* SECCIÓN NO EDITABLE */}
        {!editando && (
          <div className="space-y-2">
            <p><strong>Nombre:</strong> {cliente.nombre} {cliente.apellido}</p>
            <p><strong>Edad:</strong> {cliente.edad}</p>
            <p><strong>Sexo:</strong> {cliente.sexo}</p>
            <p><strong>Peso:</strong> {cliente.peso} kg</p>
            <p><strong>Altura:</strong> {cliente.altura} cm</p>
            <p><strong>Días de entrenamiento:</strong> {cliente.diasEntrenamiento}</p>

            <p>
              <strong>Historial de lesiones:</strong><br />
              {cliente.historialDeLesiones || "Sin registro"}
            </p>

            <div className="flex justify-between mt-4">
              <UIButton variant="gold" onClick={() => setEditando(true)}>
                Editar
              </UIButton>
              <UIButton variant="danger" onClick={handleEliminar}>
                Eliminar
              </UIButton>
            </div>
          </div>
        )}

        {/* SECCIÓN EDITABLE */}
        {editando && (
          <div className="space-y-3">
            
            <input
              type="number"
              value={cliente.edad}
              onChange={(e) => handleChange("edad", parseInt(e.target.value))}
              placeholder="Edad"
              className="w-full p-2 rounded border bg-[var(--color-fondo)] text-[var(--color-texto)]"
            />

            <select
              value={cliente.sexo}
              onChange={(e) => handleChange("sexo", e.target.value)}
              className="w-full p-2 rounded border bg-[var(--color-fondo)]"
            >
              <option value="">Sexo</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>

            <input
              type="number"
              value={cliente.peso}
              onChange={(e) => handleChange("peso", parseFloat(e.target.value))}
              placeholder="Peso (kg)"
              className="w-full p-2 rounded border bg-[var(--color-fondo)]"
            />

            <input
              type="number"
              value={cliente.altura}
              onChange={(e) => handleChange("altura", parseFloat(e.target.value))}
              placeholder="Altura (cm)"
              className="w-full p-2 rounded border bg-[var(--color-fondo)]"
            />

            <input
              type="number"
              value={cliente.diasEntrenamiento}
              onChange={(e) =>
                handleChange("diasEntrenamiento", parseInt(e.target.value))
              }
              placeholder="Días entrenamiento por semana"
              className="w-full p-2 rounded border bg-[var(--color-fondo)]"
            />

            <textarea
              value={cliente.historialDeLesiones}
              onChange={(e) => handleChange("historialDeLesiones", e.target.value)}
              placeholder="Historial de lesiones"
              className="w-full p-2 rounded border bg-[var(--color-fondo)]"
            />

            <div className="flex justify-between mt-2">
              <UIButton variant="gold" onClick={handleGuardar}>
                Guardar
              </UIButton>
              <UIButton variant="primary" onClick={() => setEditando(false)}>
                Cancelar
              </UIButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
