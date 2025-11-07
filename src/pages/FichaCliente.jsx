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

  if (!cliente) return <div className="p-6 text-[var(--color-texto)]">Cargando cliente...</div>;

  const handleChange = (field, value) => {
    setCliente(prev => ({ ...prev, [field]: value }));
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
        <div className="text-2xl font-bold text-center mb-4" style={{ color: "var(--color-dorado)" }}>
          Ficha del cliente
        </div>

        {editando ? (
          <>
            <input
              type="text"
              value={cliente.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              className="w-full p-2 rounded border border-[var(--color-borde)] bg-[var(--color-fondo)] text-[var(--color-texto)]"
            />
            <input
              type="text"
              value={cliente.apellido}
              onChange={(e) => handleChange("apellido", e.target.value)}
              className="w-full p-2 rounded border border-[var(--color-borde)] bg-[var(--color-fondo)] text-[var(--color-texto)]"
            />
            <input
              type="number"
              value={cliente.edad}
              onChange={(e) => handleChange("edad", parseInt(e.target.value))}
              className="w-full p-2 rounded border border-[var(--color-borde)] bg-[var(--color-fondo)] text-[var(--color-texto)]"
            />
            <textarea
              value={cliente.historialLesiones}
              onChange={(e) => handleChange("historialLesiones", e.target.value)}
              className="w-full p-2 rounded border border-[var(--color-borde)] bg-[var(--color-fondo)] text-[var(--color-texto)]"
            />
            <input
              type="number"
              value={cliente.peso}
              onChange={(e) => handleChange("peso", parseFloat(e.target.value))}
              className="w-full p-2 rounded border border-[var(--color-borde)] bg-[var(--color-fondo)] text-[var(--color-texto)]"
            />
            <input
              type="number"
              value={cliente.altura}
              onChange={(e) => handleChange("altura", parseFloat(e.target.value))}
              className="w-full p-2 rounded border border-[var(--color-borde)] bg-[var(--color-fondo)] text-[var(--color-texto)]"
            />
            <input
              type="number"
              value={cliente.diasSemana}
              onChange={(e) => handleChange("diasSemana", parseInt(e.target.value))}
              className="w-full p-2 rounded border border-[var(--color-borde)] bg-[var(--color-fondo)] text-[var(--color-texto)]"
            />
            <input
              type="date"
              value={cliente.fechaInicio}
              onChange={(e) => handleChange("fechaInicio", e.target.value)}
              className="w-full p-2 rounded border border-[var(--color-borde)] bg-[var(--color-fondo)] text-[var(--color-texto)]"
            />
            <div className="flex justify-between mt-2">
              <UIButton variant="gold" onClick={handleGuardar}>Guardar</UIButton>
              <UIButton variant="primary" onClick={() => setEditando(false)}>Cancelar</UIButton>
            </div>
          </>
        ) : (
          <>
            <p><strong>Nombre:</strong> {cliente.nombre} {cliente.apellido}</p>
            <p><strong>Edad:</strong> {cliente.edad}</p>
            <p><strong>Historial de lesiones:</strong> {cliente.historialLesiones}</p>
            <p><strong>Peso:</strong> {cliente.peso} kg</p>
            <p><strong>Altura:</strong> {cliente.altura} cm</p>
            <p><strong>Días por semana:</strong> {cliente.diasSemana}</p>
            <p><strong>Fecha de inicio:</strong> {cliente.fechaInicio}</p>

            <div className="mt-4">
              <div className="font-bold mb-1">Cuotas:</div>
              <ul className="list-disc ml-5">
                {cliente.cuotas && cliente.cuotas.map((c, i) => (
                  <li key={i}>{c.fecha} - {c.estado}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between mt-4">
              <UIButton variant="gold" onClick={() => setEditando(true)}>Editar</UIButton>
              <UIButton variant="danger" onClick={handleEliminar}>Eliminar</UIButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
