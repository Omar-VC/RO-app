import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { obtenerCuotasPorCliente, escucharCuotasPorCliente } from "../firebase/cuotas";

export default function ClienteCuotas() {
  const { currentUser } = useAuth();
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("Cliente actual (Auth):", currentUser);

  // 🔥 Escuchar cuotas en tiempo real
  useEffect(() => {
    if (!currentUser) return;

    console.log("Escuchando cuotas para:", currentUser.uid);

    const unsubscribe = escucharCuotasPorCliente(currentUser.uid, (nuevasCuotas) => {
      console.log("Cuotas actualizadas en tiempo real:", nuevasCuotas);
      setCuotas(nuevasCuotas);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) return <p>Cargando cuotas...</p>;

  return (
    <div className="min-h-screen p-6 text-[var(--color-texto)] bg-[var(--color-fondo)]">
      <h1 className="text-3xl font-bold mb-6 text-center">Mis Cuotas</h1>

      <div className="bg-white/10 backdrop-blur p-4 rounded-xl shadow-xl max-w-3xl mx-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-2">Mes</th>
              <th className="p-2">Monto</th>
              <th className="p-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {cuotas.map((cuota) => (
              <tr key={cuota.id} className="border-b border-gray-700">
                <td className="p-2 capitalize">{cuota.mes}</td>
                <td className="p-2">${cuota.monto}</td>
                <td className="p-2">
                  {cuota.estado === "Pagado" ? (
                    <span className="text-green-400 font-bold">Pagado</span>
                  ) : (
                    <span className="text-red-400 font-bold">Debe</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
