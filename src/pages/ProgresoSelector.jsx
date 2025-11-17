// src/pages/ProgresoSelector.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import UIButton from "../components/UIButton";
import Progreso from "./Progreso";

export default function ProgresoSelector() {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
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

  if (loading)
    return <p className="text-center mt-10 text-[var(--color-texto)]">Cargando clientes...</p>;

  if (clienteSeleccionado)
    return (
      <Progreso
        cliente={clienteSeleccionado}
        volver={() => setClienteSeleccionado(null)}
      />
    );

  return (
    <div className="min-h-screen p-6 bg-[var(--color-fondo)] text-[var(--color-texto)]">
      <h1 className="text-3xl font-bold mb-6 text-[var(--color-dorado)]">Progreso</h1>
      <p className="text-gray-400 mb-4">Seleccioná un cliente para ver su progreso.</p>

      <div className="grid gap-4">
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            className="p-4 bg-[var(--color-card)] rounded-xl shadow-md flex justify-between items-center hover:shadow-[0_0_15px_var(--color-dorado)] transition transform hover:-translate-y-1 cursor-pointer"
          >
            <div>
              <p className="font-semibold text-lg">
                {cliente.nombre} {cliente.apellido}
              </p>
              <p className="text-gray-400 text-sm">Edad: {cliente.edad}</p>
            </div>

            <UIButton variant="gold" onClick={() => setClienteSeleccionado(cliente)}>
              Ver progreso
            </UIButton>
          </div>
        ))}
      </div>
    </div>
  );
}
