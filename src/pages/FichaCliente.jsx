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

  if (!cliente) return <div className="p-6">Cargando cliente...</div>;

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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
        <div className="text-2xl font-bold text-center">Ficha del cliente</div>

        {editando ? (
          <>
            <input
              type="text"
              value={cliente.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              value={cliente.apellido}
              onChange={(e) => handleChange("apellido", e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              value={cliente.edad}
              onChange={(e) => handleChange("edad", parseInt(e.target.value))}
              className="border p-2 rounded w-full"
            />
            <textarea
              value={cliente.historialLesiones}
              onChange={(e) => handleChange("historialLesiones", e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              value={cliente.peso}
              onChange={(e) => handleChange("peso", parseFloat(e.target.value))}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              value={cliente.altura}
              onChange={(e) => handleChange("altura", parseFloat(e.target.value))}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              value={cliente.diasSemana}
              onChange={(e) => handleChange("diasSemana", parseInt(e.target.value))}
              className="border p-2 rounded w-full"
            />
            <input
              type="date"
              value={cliente.fechaInicio}
              onChange={(e) => handleChange("fechaInicio", e.target.value)}
              className="border p-2 rounded w-full"
            />
            <div className="flex justify-between mt-2">
              <UIButton onClick={handleGuardar}>Guardar</UIButton>
              <UIButton onClick={() => setEditando(false)}>Cancelar</UIButton>
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
              <UIButton onClick={() => setEditando(true)}>Editar</UIButton>
              <UIButton onClick={handleEliminar} className="bg-red-500 hover:bg-red-600">Eliminar</UIButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
