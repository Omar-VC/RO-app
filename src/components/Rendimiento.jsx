import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Rendimiento({ clienteId }) {
  const [rendimiento, setRendimiento] = useState({
    fuerza: {
      sentadillas: { inicial: 0, actual: 0 },
      flexiones: { inicial: 0, actual: 0 },
      abdominales: { inicial: 0, actual: 0 },
    },
    velocidad: { inicial: 0, actual: 0 },
    resistencia: { inicial: 0, actual: 0 },
  });
  const [rendimientoId, setRendimientoId] = useState(null);

  // Cargar datos desde Firestore
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const q = query(collection(db, "rendimiento"), where("clienteId", "==", clienteId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docSnap = snap.docs[0];
          setRendimiento(docSnap.data());
          setRendimientoId(docSnap.id);
        }
      } catch (error) {
        console.error("Error al cargar rendimiento:", error);
      }
    };
    if (clienteId) cargarDatos();
  }, [clienteId]);

  // Guardar cambios en Firestore
  const guardarCambios = async (campo, valores) => {
    const nuevosDatos = { ...rendimiento, [campo]: valores };
    setRendimiento(nuevosDatos);

    try {
      if (rendimientoId) {
        await setDoc(doc(db, "rendimiento", rendimientoId), { ...nuevosDatos, clienteId });
      } else {
        const ref = await addDoc(collection(db, "rendimiento"), { ...nuevosDatos, clienteId });
        setRendimientoId(ref.id);
      }
    } catch (error) {
      console.error("Error al guardar rendimiento:", error);
    }
  };

  // Tarjetas configuradas
  const tarjetas = [
    {
      nombre: "Fuerza",
      campo: "fuerza",
      bloques: [
        { label: "Sentadillas", key: "sentadillas" },
        { label: "Flexiones", key: "flexiones" },
        { label: "Abdominales", key: "abdominales" },
      ],
    },
    {
      nombre: "Velocidad (50m)",
      campo: "velocidad",
      bloques: [
        { label: "Tiempo inicial (s)", key: "inicial" },
        { label: "Nuevo tiempo (s)", key: "actual" },
      ],
    },
    {
      nombre: "Resistencia",
      campo: "resistencia",
      bloques: [
        { label: "Distancia inicial (m)", key: "inicial" },
        { label: "Distancia nueva (m)", key: "actual" },
      ],
    },
  ];

  return (
    <div className="space-y-6 mt-8">
      {tarjetas.map(({ nombre, campo, bloques }) => (
        <div key={campo} className="bg-white p-4 rounded-xl shadow-md">
          <h4 className="font-semibold text-blue-600 mb-3">{nombre}</h4>

          {/* Gráfico */}
          <div className="h-40 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bloques.map((b) => ({
                  name: b.label,
                  valor: rendimiento[campo]?.[b.key]?.actual ?? rendimiento[campo]?.[b.key]?.nuevo ?? rendimiento[campo]?.[b.key] ?? 0,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Inputs */}
          <div className="grid gap-3">
            {bloques.map((b) => (
              <div key={b.key}>
                <label className="text-gray-700">{b.label}</label>
                <input
                  type="number"
                  value={
                    rendimiento[campo]?.[b.key]?.actual ??
                    rendimiento[campo]?.[b.key]?.nuevo ??
                    rendimiento[campo]?.[b.key] ??
                    0
                  }
                  onChange={(e) => {
                    const valor = Number(e.target.value);
                    setRendimiento({
                      ...rendimiento,
                      [campo]: {
                        ...rendimiento[campo],
                        [b.key]: {
                          ...rendimiento[campo][b.key],
                          actual: valor,
                        },
                      },
                    });
                  }}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => guardarCambios(campo, rendimiento[campo])}
            className="mt-3 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Guardar
          </button>
        </div>
      ))}
    </div>
  );
}
