import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputSelect from "../components/InputSelect";
import UIButton from "../components/UIButton";
import { obtenerClientes, agregarCliente } from "../firebase/clientes";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    historialLesiones: "",
    peso: "",
    altura: "",
    diasSemana: "",
    fechaInicio: "",
    cuotas: [],
  });

  const navigate = useNavigate();

  // 🔹 Cargar clientes desde Firestore
  useEffect(() => {
    async function cargarClientes() {
      const data = await obtenerClientes();
      setClientes(data);
    }
    cargarClientes();
  }, []);

  const handleSelect = (e) => {
    setClienteSeleccionado(e.target.value);
  };

  const handleAgregar = () => {
    setMostrarFormulario(true);
  };

  const handleGuardarNuevo = async () => {
    const id = await agregarCliente(nuevoCliente);
    setClientes((prev) => [...prev, { id, ...nuevoCliente }]);
    setMostrarFormulario(false);
    alert("Cliente agregado correctamente");
  };

  const handleVerFicha = () => {
    console.log("Cliente seleccionado:", clienteSeleccionado);
    if (clienteSeleccionado) navigate(`/clientes/${clienteSeleccionado}`);
    else alert("Seleccioná un cliente primero");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <div className="text-3xl font-bold mb-4 text-center">Clientes</div>

        {mostrarFormulario ? (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoCliente.nombre}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Apellido"
              value={nuevoCliente.apellido}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, apellido: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Edad"
              value={nuevoCliente.edad}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, edad: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Historial de lesiones"
              value={nuevoCliente.historialLesiones}
              onChange={(e) =>
                setNuevoCliente({
                  ...nuevoCliente,
                  historialLesiones: e.target.value,
                })
              }
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Peso (kg)"
              value={nuevoCliente.peso}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, peso: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Altura (cm)"
              value={nuevoCliente.altura}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, altura: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Días de entrenamiento por semana"
              value={nuevoCliente.diasSemana}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, diasSemana: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
            <input
              type="date"
              value={nuevoCliente.fechaInicio}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, fechaInicio: e.target.value })
              }
              className="border p-2 rounded w-full"
            />

            <div className="flex justify-between mt-4">
              <UIButton onClick={handleGuardarNuevo}>Guardar</UIButton>
              <UIButton onClick={() => setMostrarFormulario(false)}>
                Cancelar
              </UIButton>
            </div>
          </div>
        ) : (
          <>
           <select
  value={clienteSeleccionado}
  onChange={(e) => setClienteSeleccionado(e.target.value)}
  className="border p-2 rounded w-full"
>
  <option value="">Seleccionar cliente</option>
  {clientes.map((c) => (
    <option key={c.id} value={c.id}>
      {c.nombre} {c.apellido}
    </option>
  ))}
</select>
            <div className="flex justify-between mt-4">
              <UIButton onClick={handleAgregar}>+ Agregar cliente</UIButton>
              <UIButton onClick={handleVerFicha}>Ver ficha</UIButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
