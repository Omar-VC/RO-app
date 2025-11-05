import React, { useState, useEffect } from "react";
import { User, Activity, Dumbbell, Clock, ClipboardList, MessageSquare } from "lucide-react";
import UIButton from "../components/UIButton";

export default function Progreso() {
  const [cliente, setCliente] = useState({
    nombre: "Juan Pérez",
    edad: 28,
    ultimaActualizacion: "02/11/2025",
    peso: 75,
    grasa: 14,
    potencia: 82,
  });

  // Bloque 1: Resumen rápido del cliente
  const renderResumen = () => (
    <div className="bg-white rounded-xl shadow p-5 mb-6">
      <div className="flex items-center gap-4 border-b pb-4 mb-4">
        <img
          src="https://i.pravatar.cc/80"
          alt="avatar"
          className="w-16 h-16 rounded-full border"
        />
        <div>
          <h2 className="text-2xl font-bold">{cliente.nombre}</h2>
          <p className="text-gray-600">
            {cliente.edad} años • Última actualización:{" "}
            <span className="text-blue-600 font-medium">
              {cliente.ultimaActualizacion}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Peso</p>
          <p className="text-xl font-semibold text-blue-700">{cliente.peso} kg</p>
        </div>
        <div className="bg-pink-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">% Grasa</p>
          <p className="text-xl font-semibold text-pink-700">{cliente.grasa}%</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Potencia</p>
          <p className="text-xl font-semibold text-green-700">{cliente.potencia}</p>
        </div>
      </div>
    </div>
  );

  // Bloque 2: Capacidades físicas
  const renderCapacidades = () => (
    <div className="bg-white rounded-xl shadow p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Dumbbell className="text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">Capacidades Físicas</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {["Fuerza", "Potencia", "Velocidad", "Agilidad", "Resistencia", "Composición corporal"].map((cap, i) => (
          <div key={i} className="border rounded-lg p-3 hover:shadow transition">
            <p className="font-semibold text-gray-700">{cap}</p>
            <p className="text-sm text-gray-500">Último valor: —</p>
            <UIButton className="mt-2 text-sm">Ver historial</UIButton>
          </div>
        ))}
      </div>
    </div>
  );

  // Bloque 3: Rutinas o planes actuales
  const renderRutinas = () => (
    <div className="bg-white rounded-xl shadow p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="text-green-600" />
        <h3 className="text-xl font-bold text-gray-800">Rutina Actual</h3>
      </div>
      <p className="text-gray-600">
        Objetivo: <span className="font-semibold text-gray-800">Fuerza y potencia</span>
      </p>
      <p className="text-gray-600 mb-2">
        Duración: <span className="font-semibold text-gray-800">4 semanas</span>
      </p>
      <UIButton className="text-sm">Ver detalle</UIButton>
    </div>
  );

  // Bloque 4: Historial
  const renderHistorial = () => (
    <div className="bg-white rounded-xl shadow p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-orange-600" />
        <h3 className="text-xl font-bold text-gray-800">Historial de evolución</h3>
      </div>
      <p className="text-gray-600 italic">Sin datos por ahora.</p>
    </div>
  );

  // Bloque 5: Notas o comentarios
  const renderNotas = () => (
    <div className="bg-white rounded-xl shadow p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="text-purple-600" />
        <h3 className="text-xl font-bold text-gray-800">Notas y observaciones</h3>
      </div>
      <p className="text-gray-600 italic">
        “Buen progreso en la última fase. Mejoró su fuerza de tren inferior.”
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Activity className="text-orange-600" /> Progreso del Cliente
        </h1>

        {renderResumen()}
        {renderCapacidades()}
        {renderRutinas()}
        {renderHistorial()}
        {renderNotas()}
      </div>
    </div>
  );
}
