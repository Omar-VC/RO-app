// src/pages/AgregarCliente.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import UIButton from "../components/UIButton";

export default function AgregarCliente() {
  const [usuariosAprobados, setUsuariosAprobados] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [form, setForm] = useState({
    edad: "",
    sexo: "",
    altura: "",
    peso: "",
    historialDeLesiones: "",
    diasEntrenamiento: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
  const cargarUsuarios = async () => {
    const snap = await getDocs(collection(db, "usuarios"));
    const aprobados = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((u) => u.estado === "aprobado");

    setUsuariosAprobados(aprobados);
  };
  cargarUsuarios();
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuarioSeleccionado) return alert("Selecciona un usuario");

    const usuario = usuariosAprobados.find((u) => u.id === usuarioSeleccionado);

    const nuevoCliente = {
      uidUsuario: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      edad: Number(form.edad),
      sexo: form.sexo,
      altura: Number(form.altura),
      peso: Number(form.peso),
      historialDeLesiones: form.historialDeLesiones,
      diasEntrenamiento: Number(form.diasEntrenamiento),
      creadoEn: new Date().toISOString()
    };

    await addDoc(collection(db, "clientes"), nuevoCliente);

    alert("Cliente creado correctamente");
    navigate("/clientes");
  };

  return (
    <div className="p-6 min-h-screen bg-[var(--color-fondo)] text-[var(--color-texto)]">
      <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--color-dorado)" }}>
        Agregar Cliente
      </h2>

      {/* SELECT USUARIO */}
      <label className="block mb-2">Seleccionar usuario aprobado:</label>
      <select
        className="w-full p-2 rounded mb-4 bg-[var(--color-card)]"
        onChange={(e) => setUsuarioSeleccionado(e.target.value)}
      >
        <option value="">-- Elegir usuario --</option>
        {usuariosAprobados.map((u) => (
          <option key={u.id} value={u.id}>
            {u.nombre} {u.apellido}
          </option>
        ))}
      </select>

      {/* FORMULARIO SOLO SI SELECCIONÓ */}
      {usuarioSeleccionado && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-[var(--color-card)] p-4 rounded-xl">
          <input
            type="number"
            placeholder="Edad"
            className="w-full p-2 rounded"
            value={form.edad}
            onChange={(e) => setForm({ ...form, edad: e.target.value })}
          />

          <select
            className="w-full p-2 rounded"
            value={form.sexo}
            onChange={(e) => setForm({ ...form, sexo: e.target.value })}
          >
            <option value="">Sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>

          <input
            type="number"
            placeholder="Altura (cm)"
            className="w-full p-2 rounded"
            value={form.altura}
            onChange={(e) => setForm({ ...form, altura: e.target.value })}
          />

          <input
            type="number"
            placeholder="Peso (kg)"
            className="w-full p-2 rounded"
            value={form.peso}
            onChange={(e) => setForm({ ...form, peso: e.target.value })}
          />

          <textarea
            placeholder="Historial de lesiones"
            className="w-full p-2 rounded"
            value={form.historialDeLesiones}
            onChange={(e) => setForm({ ...form, historialDeLesiones: e.target.value })}
          />

          <input
            type="number"
            placeholder="Días de entrenamiento por semana"
            className="w-full p-2 rounded"
            value={form.diasEntrenamiento}
            onChange={(e) => setForm({ ...form, diasEntrenamiento: e.target.value })}
          />

          <UIButton variant="gold" type="submit">
            Guardar Cliente
          </UIButton>
        </form>
      )}
    </div>
  );
}
