
// src/pages/Clientes.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import UIButton from "../components/UIButton";

// 👇 Importamos el contexto
import { useCliente } from "../context/ClienteContext";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clienteSeleccionadoId, setClienteSeleccionadoId] = useState("");
  const navigate = useNavigate();

  // 👇 Obtenemos la función para guardar el cliente en el contexto
  const { setClienteSeleccionado } = useCliente();

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "clientes"));
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClientes(lista);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerClientes();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-[var(--color-texto)]">
        Cargando clientes...
      </p>
    );

  return (
    <div className="p-6 min-h-screen bg-[var(--color-fondo)]">
      
      {/* TITULO */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-dorado)]">
          Clientes
        </h1>

        <UIButton
          variant="gold"
          onClick={() => navigate("/clientes/agregar")}
        >
          Agregar Cliente
        </UIButton>
      </div>

      {/* SELECT + BOTON */}
      <div className="bg-[var(--color-card)] p-4 rounded-xl shadow-md mb-6 flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-[var(--color-texto)] text-sm">Seleccionar cliente</label>
          <select
            value={clienteSeleccionadoId}
            onChange={(e) => setClienteSeleccionadoId(e.target.value)}
            className="w-full mt-1 p-2 rounded-lg bg-[var(--color-fondo)] border border-[var(--color-borde)] text-[var(--color-texto)]"
          >
            <option value="">-- Elegir cliente --</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} {c.apellido}
              </option>
            ))}
          </select>
        </div>

        <UIButton
          variant="gold"
          onClick={() => {
            if (clienteSeleccionadoId) {
              // 👇 Guardamos el cliente completo en el contexto
              const clienteObj = clientes.find(c => c.id === clienteSeleccionadoId);
              if (clienteObj) setClienteSeleccionado(clienteObj);

              navigate(`/progreso/${clienteSeleccionadoId}`);
            }
          }}
        >
          Ver Progreso
        </UIButton>
      </div>

      {/* LISTA DE CLIENTES */}
      <div className="grid gap-4">
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            className="p-4 rounded-xl shadow-md flex justify-between items-center
                       bg-[var(--color-card)] transition transform hover:-translate-y-1 
                       hover:shadow-[0_0_15px_var(--color-dorado)] border border-transparent"
          >
            <div>
              <p className="font-semibold text-lg text-[var(--color-texto)]">
                {cliente.nombre} {cliente.apellido}
              </p>
              <p className="text-sm text-[var(--color-texto)]">
                Edad: {cliente.edad}
              </p>
            </div>

            <UIButton
              onClick={() => {
                setClienteSeleccionado(cliente); // 👈 guardamos en contexto
                navigate(`/clientes/${cliente.id}`);
              }}
              variant="gold"
            >
              Ficha
            </UIButton>
          </div>
        ))}

        {clientes.length === 0 && (
          <p className="text-center mt-4 text-[var(--color-texto)]">
            No hay clientes registrados
          </p>
        )}
      </div>

    </div>
  );
}
