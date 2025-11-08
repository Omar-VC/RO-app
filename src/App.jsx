// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import FichaCliente from "./pages/FichaCliente";
import Cuotas from "./pages/Cuotas";
import Progreso from "./pages/Progreso";
import Login from "./pages/Login";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const location = useLocation();
  const hideHeader = location.pathname === "/login";

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
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
        {/* 🔧 Ajusta esta según la opción que elijas */}
        <Route
          path="/progreso"
          element={
            <ProtectedRoute>
              <Progreso />
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
