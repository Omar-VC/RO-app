import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

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

  if (loading) return <p className="text-center mt-10">Cargando clientes...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Clientes</h1>

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
              onClick={() => navigate(`/clientes/${cliente.id}`)}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition"
            >
              Ficha
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
