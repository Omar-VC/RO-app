import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import UIButton from "../components/UIButton";

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
        <div key={campo} className="bg-[var(--color-card)] p-4 rounded-xl shadow-md">
          <h4 className="font-semibold text-[var(--color-dorado)] mb-3">{nombre}</h4>

          {/* Gráfico */}
          <div className="h-40 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bloques.map((b) => ({
                  name: b.label,
                  valor:
                    rendimiento[campo]?.[b.key]?.actual ??
                    rendimiento[campo]?.[b.key]?.nuevo ??
                    rendimiento[campo]?.[b.key] ??
                    0,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-borde)" />
                <XAxis dataKey="name" stroke="var(--color-texto)" />
                <YAxis stroke="var(--color-texto)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "transparent", color: "var(--color-texto)", border: "none" }}
                  itemStyle={{ color: "var(--color-dorado)" }}
                  cursor={{ fill: "transparent" }}
                />

                <Bar dataKey="valor" fill="rgba(212, 175, 55, 0.6)" />

              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Inputs */}
          <div className="grid gap-3">
            {bloques.map((b) => (
              <div key={b.key}>
                <label className="text-[var(--color-texto)]">{b.label}</label>
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
                  className="w-full border rounded-lg px-3 py-2 bg-[var(--color-fondo)] text-[var(--color-texto)] border-[var(--color-borde)]"
                />
              </div>
            ))}
          </div>

          <UIButton
            onClick={() => guardarCambios(campo, rendimiento[campo])}
            variant="gold"
            className="mt-3"
          >
            Guardar
          </UIButton>
        </div>
      ))}
    </div>
  );
}
