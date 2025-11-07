// src/pages/Clientes.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import UIButton from "../components/UIButton";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--color-dorado)" }}
      >
        Clientes
      </h1>

      <div className="grid gap-4">
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            style={{ backgroundColor: "var(--color-card)" }}
            className="p-4 rounded-xl shadow-md flex justify-between items-center
                       transition transform hover:-translate-y-1 hover:shadow-[0_0_15px_var(--color-dorado)] border border-transparent"
          >
            <div>
              <p
                className="font-semibold text-lg"
                style={{ color: "var(--color-texto)" }}
              >
                {cliente.nombre} {cliente.apellido}
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--color-texto)" }}
              >
                Edad: {cliente.edad}
              </p>
            </div>

            <UIButton
              onClick={() => navigate(`/clientes/${cliente.id}`)}
              variant="gold"
            >
              Ficha
            </UIButton>
          </div>
        ))}

        {clientes.length === 0 && (
          <p
            className="text-center mt-4"
            style={{ color: "var(--color-texto)" }}
          >
            No hay clientes registrados
          </p>
        )}
      </div>
    </div>
  );
}
