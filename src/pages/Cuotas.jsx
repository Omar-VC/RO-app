// src/pages/Cuotas.jsx
import { useEffect, useState } from "react";
import { FaMoneyBillWave, FaCheckCircle, FaEdit, FaTrash } from "react-icons/fa";
import UIButton from "../components/UIButton";
import { obtenerCuotas, agregarCuota, actualizarCuota, eliminarCuota } from "../firebase/cuotas";
import { obtenerClientes } from "../firebase/clientes";

export default function Cuotas() {
  const [cuotas, setCuotas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form nuevo/editar
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    clienteId: "",
    clienteNombre: "",
    mes: "",
    anio: new Date().getFullYear(),
    monto: "",
    estado: "Debe"
  });

  const loadData = async () => {
    setLoading(true);
    const [c, cu] = await Promise.all([obtenerClientes(), obtenerCuotas()]);
    setClientes(c);
    setCuotas(cu.sort((a,b) => (a.anio === b.anio ? (a.mes.localeCompare(b.mes)) : a.anio - b.anio)));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const abrirFormNuevo = async () => {
    await loadData(); // 👈 Asegura tener los clientes actualizados
    setEditingId(null);
    setForm({
      clienteId: "",
      clienteNombre: "",
      mes: "",
      anio: new Date().getFullYear(),
      monto: "",
      estado: "Debe"
    });
    setShowForm(true);
  };

  const abrirEditar = (cuota) => {
    setEditingId(cuota.id);
    setForm({
      clienteId: cuota.clienteId,
      clienteNombre: cuota.clienteNombre,
      mes: cuota.mes,
      anio: cuota.anio,
      monto: cuota.monto,
      estado: cuota.estado
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.clienteId || !form.mes || !form.anio || !form.monto) {
      alert("Completá cliente, mes, año y monto.");
      return;
    }

    // Asegurar clienteNombre sincronizado
    const clienteObj = clientes.find(c => c.id === form.clienteId);
    const payload = { ...form, clienteNombre: clienteObj ? `${clienteObj.nombre} ${clienteObj.apellido}` : form.clienteNombre };

    if (editingId) {
      await actualizarCuota(editingId, payload);
    } else {
      await agregarCuota(payload);
    }

    await loadData();
    setShowForm(false);
  };

  const handleMarcarPagado = async (id) => {
    await actualizarCuota(id, { estado: "Pagado" });
    await loadData();
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar cuota?")) return;
    await eliminarCuota(id);
    await loadData();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaMoneyBillWave className="text-green-600" size={28} />
            <h2 className="text-2xl font-bold">Cuotas</h2>
          </div>
          <UIButton onClick={abrirFormNuevo}>+ Nueva cuota</UIButton>
        </div>

        {showForm && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                className="border p-2 rounded"
                value={form.clienteId}
                onChange={(e) => {
                  const id = e.target.value;
                  const c = clientes.find(x => x.id === id);
                  setForm(prev => ({ ...prev, clienteId: id, clienteNombre: c ? `${c.nombre} ${c.apellido}` : "" }));
                }}
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>)}
              </select>

              <input
                className="border p-2 rounded"
                placeholder="Mes (ej: Noviembre)"
                value={form.mes}
                onChange={(e) => setForm(prev => ({ ...prev, mes: e.target.value }))}
              />

              <input
                type="number"
                className="border p-2 rounded"
                value={form.anio}
                onChange={(e) => setForm(prev => ({ ...prev, anio: Number(e.target.value) }))}
              />
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                className="border p-2 rounded"
                placeholder="Monto"
                value={form.monto}
                onChange={(e) => setForm(prev => ({ ...prev, monto: e.target.value }))}
              />
              <select
                className="border p-2 rounded"
                value={form.estado}
                onChange={(e) => setForm(prev => ({ ...prev, estado: e.target.value }))}
              >
                <option value="Debe">Debe</option>
                <option value="Pagado">Pagado</option>
              </select>
              <div className="flex gap-2">
                <UIButton onClick={handleSubmit}>{editingId ? "Guardar cambios" : "Crear cuota"}</UIButton>
                <UIButton onClick={() => setShowForm(false)}>Cancelar</UIButton>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div>Cargando cuotas...</div>
        ) : (
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Mes</th>
                  <th className="p-3">Año</th>
                  <th className="p-3">Monto</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cuotas.map(cuota => (
                  <tr key={cuota.id} className="border-t">
                    <td className="p-3">{cuota.clienteNombre}</td>
                    <td className="p-3">{cuota.mes}</td>
                    <td className="p-3">{cuota.anio}</td>
                    <td className="p-3">${cuota.monto}</td>
                    <td className="p-3">
                      <span className={cuota.estado === "Pagado" ? "text-green-600" : "text-red-600"}>{cuota.estado}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleMarcarPagado(cuota.id)} title="Marcar pagado" className="p-2 rounded bg-green-50 hover:bg-green-100">
                          <FaCheckCircle className="text-green-600" />
                        </button>
                        <button onClick={() => abrirEditar(cuota)} title="Editar" className="p-2 rounded bg-blue-50 hover:bg-blue-100">
                          <FaEdit className="text-blue-600" />
                        </button>
                        <button onClick={() => handleEliminar(cuota.id)} title="Eliminar" className="p-2 rounded bg-red-50 hover:bg-red-100">
                          <FaTrash className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {cuotas.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">No hay cuotas registradas</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
