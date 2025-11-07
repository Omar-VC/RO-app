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
import UIButton from "../components/UIButton";

export default function Progreso() {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [sesiones, setSesiones] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(true);

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

  const fetchSesiones = async (clienteId) => {
    const q = query(collection(db, "sesiones"), where("clienteId", "==", clienteId));
    const snapshot = await getDocs(q);
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSesiones(lista);
  };

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    fetchSesiones(cliente.id);
  };

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

  const eliminarSesion = async (id) => {
    try {
      await deleteDoc(doc(db, "sesiones", id));
      fetchSesiones(clienteSeleccionado.id);
    } catch (error) {
      console.error("Error al eliminar sesión:", error);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-[var(--color-texto)]">Cargando clientes...</p>;

  return (
    <div className="min-h-screen p-6 bg-[var(--color-fondo)] text-[var(--color-texto)]">
      {!clienteSeleccionado ? (
        <>
          <h1 className="text-3xl font-bold mb-6 text-[var(--color-dorado)]">Progreso</h1>
          <p className="text-gray-400 mb-4">
            Seleccioná un cliente para ver su progreso y sesiones.
          </p>

          <div className="grid gap-4">
            {clientes.map((cliente) => (
              <div
                key={cliente.id}
                className="p-4 bg-[var(--color-card)] rounded-xl shadow-md flex justify-between items-center hover:shadow-[0_0_15px_var(--color-dorado)] transition transform hover:-translate-y-1 cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-lg">{cliente.nombre} {cliente.apellido}</p>
                  <p className="text-gray-400 text-sm">Edad: {cliente.edad}</p>
                </div>

                <UIButton variant="gold" onClick={() => seleccionarCliente(cliente)}>
                  Ver progreso
                </UIButton>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setClienteSeleccionado(null)}
              className="flex items-center gap-1 text-gray-400 hover:text-[var(--color-dorado)] transition"
            >
              <ArrowLeft size={18} /> Volver
            </button>
            <h2 className="text-2xl font-bold text-[var(--color-dorado)]">
              {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
            </h2>
          </div>

          <div className="bg-[var(--color-card)] p-4 rounded-xl shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-3 text-[var(--color-dorado)]">
              Añadir sesión de entrenamiento
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título de la sesión"
                className="w-full border border-[var(--color-borde)] rounded-lg px-3 py-2 bg-[var(--color-fondo)] text-[var(--color-texto)]"
              />
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción, ejercicios, repeticiones, bloques, etc."
                className="w-full border border-[var(--color-borde)] rounded-lg px-3 py-2 h-28 resize-none bg-[var(--color-fondo)] text-[var(--color-texto)]"
              />
              <UIButton variant="gold" onClick={agregarSesion}>
                <PlusCircle size={18} /> Añadir sesión
              </UIButton>
            </div>
          </div>

          <div className="bg-[var(--color-card)] p-4 rounded-xl shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-3 text-[var(--color-dorado)]">
              Historial de sesiones
            </h3>
            {sesiones.length === 0 ? (
              <p className="text-gray-400">No hay sesiones registradas.</p>
            ) : (
              <ul className="space-y-3">
                {sesiones.map((sesion) => (
                  <li
                    key={sesion.id}
                    className="flex justify-between items-start bg-[var(--color-fondo)] p-3 rounded-lg shadow-sm"
                  >
                    <div>
                      <p className="font-semibold text-[var(--color-dorado)]">{sesion.titulo}</p>
                      <p className="text-[var(--color-texto)] whitespace-pre-line">{sesion.descripcion}</p>
                      <p className="text-sm text-gray-400 mt-1">
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

          <div className="bg-[var(--color-card)] p-4 rounded-xl shadow-md">
            <Rendimiento clienteId={clienteSeleccionado.id} />
          </div>
        </>
      )}
    </div>
  );
}
