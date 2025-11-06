import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import Rendimiento from "../components/Rendimiento";

export default function Progreso() {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [sesiones, setSesiones] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(true);

  // Obtener todos los clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "clientes"));
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClientes(lista);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);

  // Cargar sesiones de un cliente
  const fetchSesiones = async (clienteId) => {
    const q = query(collection(db, "sesiones"), where("clienteId", "==", clienteId));
    const snapshot = await getDocs(q);
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSesiones(lista);
  };

  // Seleccionar cliente
  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    fetchSesiones(cliente.id);
  };

  // Agregar sesión
  const agregarSesion = async () => {
    if (!titulo.trim() || !descripcion.trim()) return;
    try {
      await addDoc(collection(db, "sesiones"), {
        clienteId: clienteSeleccionado.id,
        titulo,
        descripcion,
        fecha: new Date().toISOString(),
      });
      setTitulo("");
      setDescripcion("");
      fetchSesiones(clienteSeleccionado.id);
    } catch (error) {
      console.error("Error al agregar sesión:", error);
    }
  };

  // Eliminar sesión
  const eliminarSesion = async (id) => {
    try {
      await deleteDoc(doc(db, "sesiones", id));
      fetchSesiones(clienteSeleccionado.id);
    } catch (error) {
      console.error("Error al eliminar sesión:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando clientes...</p>;

  return (
    <div className="p-6">
      {!clienteSeleccionado ? (
        <>
          <h1 className="text-3xl font-bold mb-6 text-blue-600">Progreso</h1>
          <p className="text-gray-600 mb-4">
            Seleccioná un cliente para ver su progreso y sesiones.
          </p>

          <div className="grid gap-4">
            {clientes.map((cliente) => (
              <div
                key={cliente.id}
                className="p-4 bg-white rounded-xl shadow-md flex justify-between items-center hover:shadow-lg transition"
              >
                <div>
                  <p className="font-semibold text-lg">
                    {cliente.nombre} {cliente.apellido}
                  </p>
                  <p className="text-gray-500 text-sm">Edad: {cliente.edad}</p>
                </div>

                <button
                  onClick={() => seleccionarCliente(cliente)}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                >
                  Ver progreso
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Encabezado del cliente */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setClienteSeleccionado(null)}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
            >
              <ArrowLeft size={18} /> Volver
            </button>
            <h2 className="text-2xl font-bold text-blue-600">
              {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
            </h2>
          </div>

          {/* Sección de sesiones de entrenamiento */}
          <div className="bg-white p-4 rounded-xl shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Añadir sesión de entrenamiento
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título de la sesión"
                className="w-full border rounded-lg px-3 py-2"
              />

              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción, ejercicios, repeticiones, bloques, etc."
                className="w-full border rounded-lg px-3 py-2 h-28 resize-none"
              />

              <button
                onClick={agregarSesion}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <PlusCircle size={18} /> Añadir sesión
              </button>
            </div>
          </div>

          {/* Historial de sesiones */}
          <div className="bg-white p-4 rounded-xl shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Historial de sesiones
            </h3>
            {sesiones.length === 0 ? (
              <p className="text-gray-500">No hay sesiones registradas.</p>
            ) : (
              <ul className="space-y-3">
                {sesiones.map((sesion) => (
                  <li
                    key={sesion.id}
                    className="flex justify-between items-start bg-gray-50 p-3 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-blue-600">{sesion.titulo}</p>
                      <p className="text-gray-700 whitespace-pre-line">{sesion.descripcion}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(sesion.fecha).toLocaleString("es-AR")}
                      </p>
                    </div>
                    <button
                      onClick={() => eliminarSesion(sesion.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sección de rendimiento */}
          <div className="bg-white p-4 rounded-xl shadow-md">
            <Rendimiento clienteId={clienteSeleccionado.id} />
          </div>
        </>
      )}
    </div>
  );
}
