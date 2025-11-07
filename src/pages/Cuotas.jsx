import { useEffect, useState } from "react";
import { FaMoneyBillWave, FaCheckCircle, FaEdit, FaTrash } from "react-icons/fa";
import UIButton from "../components/UIButton";
import { obtenerCuotas, agregarCuota, actualizarCuota, eliminarCuota } from "../firebase/cuotas";
import { obtenerClientes } from "../firebase/clientes";

export default function Cuotas() {
  const [cuotas, setCuotas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

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
    await loadData();
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
    <div className="min-h-screen p-6" style={{ backgroundColor: "var(--color-fondo)", color: "var(--color-texto)" }}>
      <div className="max-w-5xl mx-auto">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FaMoneyBillWave className="text-[var(--color-acento)]" size={28} />
            <h2 className="text-3xl font-bold">Cuotas</h2>
          </div>
          <UIButton variant="gold" onClick={abrirFormNuevo}>
            + Nueva cuota
          </UIButton>

        </div>

        {/* Formulario */}
        {showForm && (
          <div className="p-4 rounded-lg shadow-md mb-6" style={{ backgroundColor: "var(--color-card)" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                className="p-2 rounded bg-transparent border border-gray-500 text-[var(--color-texto)]"
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
                className="p-2 rounded bg-transparent border border-gray-500 text-[var(--color-texto)] placeholder-gray-400"
                placeholder="Mes (ej: Noviembre)"
                value={form.mes}
                onChange={(e) => setForm(prev => ({ ...prev, mes: e.target.value }))}
              />

              <input
                type="number"
                className="p-2 rounded bg-transparent border border-gray-500 text-[var(--color-texto)]"
                value={form.anio}
                onChange={(e) => setForm(prev => ({ ...prev, anio: Number(e.target.value) }))}
              />
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                className="p-2 rounded bg-transparent border border-gray-500 text-[var(--color-texto)] placeholder-gray-400"
                placeholder="Monto"
                value={form.monto}
                onChange={(e) => setForm(prev => ({ ...prev, monto: e.target.value }))}
              />
              <select
                className="p-2 rounded bg-transparent border border-gray-500 text-[var(--color-texto)]"
                value={form.estado}
                onChange={(e) => setForm(prev => ({ ...prev, estado: e.target.value }))}
              >
                <option value="Debe">Debe</option>
                <option value="Pagado">Pagado</option>
              </select>
              <div className="flex gap-2">
                <UIButton onClick={handleSubmit}>{editingId ? "Guardar" : "Crear"}</UIButton>
                <UIButton onClick={() => setShowForm(false)}>Cancelar</UIButton>
              </div>
            </div>
          </div>
        )}

        {/* Tabla */}
        {loading ? (
          <div>Cargando cuotas...</div>
        ) : (
          <div className="rounded-lg shadow-md overflow-x-auto" style={{ backgroundColor: "var(--color-card)" }}>
            <table className="min-w-full table-auto text-left">
              <thead>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
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
                  <tr key={cuota.id} className="border-t border-gray-700">
                    <td className="p-3">{cuota.clienteNombre}</td>
                    <td className="p-3">{cuota.mes}</td>
                    <td className="p-3">{cuota.anio}</td>
                    <td className="p-3">${cuota.monto}</td>
                    <td className="p-3">
                      <span className={cuota.estado === "Pagado" ? "text-green-400" : "text-red-400"}>
                        {cuota.estado}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleMarcarPagado(cuota.id)} title="Marcar pagado" className="p-2 rounded hover:bg-green-900/40">
                          <FaCheckCircle className="text-green-400" />
                        </button>
                        <button onClick={() => abrirEditar(cuota)} title="Editar" className="p-2 rounded hover:bg-blue-900/40">
                          <FaEdit className="text-blue-400" />
                        </button>
                        <button onClick={() => handleEliminar(cuota.id)} title="Eliminar" className="p-2 rounded hover:bg-red-900/40">
                          <FaTrash className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {cuotas.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-400">No hay cuotas registradas</td>
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
