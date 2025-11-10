// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import FichaCliente from "./pages/FichaCliente";
import Cuotas from "./pages/Cuotas";
import Progreso from "./pages/Progreso";
import Login from "./pages/Login";
import Register from "./pages/Register"; // 👈 importamos la nueva página
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Aprobaciones from "./pages/Aprobaciones";


function AppContent() {
  const location = useLocation();

  // Ocultamos el header en login y register
  const hideHeader = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        {/* 🔓 Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* 👈 nueva ruta */}

        {/* 🔒 Rutas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes/:id"
          element={
            <ProtectedRoute>
              <FichaCliente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cuotas"
          element={
            <ProtectedRoute>
              <Cuotas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progreso"
          element={
            <ProtectedRoute>
              <Progreso />
            </ProtectedRoute>
          }
        />
        <Route
          path="/aprobaciones"
          element={
            <ProtectedRoute>
              <Aprobaciones />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
