// src/pages/Progreso.jsx
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
  getDoc,
} from "firebase/firestore";
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import Rendimiento from "../components/Rendimiento";
import UIButton from "../components/UIButton";
import { useParams } from "react-router-dom";

// 👇 Importamos el contexto
import { useCliente } from "../context/ClienteContext";

export default function Progreso({ cliente: clienteProp, volver }) {
  const { id } = useParams(); // ← ID desde URL
  const { clienteSeleccionado } = useCliente(); // 👈 obtenemos cliente global

  // 👇 Inicializamos con prop, contexto o null
  const [cliente, setCliente] = useState(clienteProp || clienteSeleccionado || null);

  const [sesiones, setSesiones] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // 👉 Si no viene cliente como prop ni contexto, lo buscamos por ID
  useEffect(() => {
    if (clienteProp || clienteSeleccionado) return;

    const fetchCliente = async () => {
      try {
        const ref = doc(db, "clientes", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setCliente({ id: snap.id, ...snap.data() });
        }
      } catch (error) {
        console.error("Error cargando cliente:", error);
      }
    };

    if (id) fetchCliente();
  }, [id, clienteProp, clienteSeleccionado]);

  // ----------------- SESIONES -----------------
  const fetchSesiones = async () => {
    if (!cliente?.id) return;
    const q = query(collection(db, "sesiones"), where("clienteId", "==", cliente.id));
    const snapshot = await getDocs(q);
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSesiones(lista);
  };

  useEffect(() => {
    if (!cliente?.id) return;
    fetchSesiones();
  }, [cliente?.id]);

  const agregarSesion = async () => {
    if (!titulo.trim() || !descripcion.trim()) return;
    try {
      await addDoc(collection(db, "sesiones"), {
        clienteId: cliente.id,
        titulo,
        descripcion,
        fecha: new Date().toISOString(),
      });
      setTitulo("");
      setDescripcion("");
      fetchSesiones();
    } catch (error) {
      console.error("Error al agregar sesión:", error);
    }
  };

  const eliminarSesion = async (id) => {
    try {
      await deleteDoc(doc(db, "sesiones", id));
      fetchSesiones();
    } catch (error) {
      console.error("Error al eliminar sesión:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[var(--color-fondo)] text-[var(--color-texto)]">
      {!cliente ? (
        <div className="p-6 text-[var(--color-texto)]">
          <p className="text-gray-400">Cargando datos del cliente...</p>
        </div>
      ) : (
        <>
          {/* VOLVER */}
          <div className="flex items-center gap-3 mb-6">
            {volver && (
              <button
                onClick={volver}
                className="flex items-center gap-1 text-gray-400 hover:text-[var(--color-dorado)] transition"
              >
                <ArrowLeft size={18} /> Volver
              </button>
            )}
            <h2 className="text-2xl font-bold text-[var(--color-dorado)]">
              {cliente.nombre} {cliente.apellido}
            </h2>
          </div>

          {/* AGREGAR SESIÓN */}
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

          {/* HISTORIAL */}
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

          {/* RENDIMIENTO */}
          <div className="bg-[var(--color-card)] p-4 rounded-xl shadow-md">
            <Rendimiento clienteId={cliente.id} />
          </div>
        </>
      )}
    </div>
  );
}

