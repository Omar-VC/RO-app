// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import FichaCliente from "./pages/FichaCliente";
import Cuotas from "./pages/Cuotas";
import Progreso from "./pages/Progreso";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Aprobaciones from "./pages/Aprobaciones";
import AgregarCliente from "./pages/AgregarCliente";

// 👇 Importamos el ClienteProvider
import { ClienteProvider } from "./context/ClienteContext";

function AppContent() {
  const location = useLocation();

  const hideHeader =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/clientes/agregar" element={<AgregarCliente />} />

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

        <Route
          path="/progreso"
          element={
            <ProtectedRoute>
              <Progreso />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progreso/:id"
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
      {/* 👇 Envolvemos todo con ClienteProvider */}
      <ClienteProvider>
        <AppContent />
      </ClienteProvider>
    </BrowserRouter>
  );
}
