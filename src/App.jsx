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
import ClienteHome from "./pages/ClienteHome";
import ClienteCuota from "./pages/ClienteCuota";
import ClienteProgreso from "./pages/ClienteProgreso";
import ClienteSesiones from "./pages/ClienteSesiones";
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

        {/* Admin */}
        <Route
          path="/"
          element={
            <ProtectedRoute role="admin">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <ProtectedRoute role="admin">
              <Clientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes/:id"
          element={
            <ProtectedRoute role="admin">
              <FichaCliente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cuotas"
          element={
            <ProtectedRoute role="admin">
              <Cuotas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progreso"
          element={
            <ProtectedRoute role="admin">
              <Progreso />
            </ProtectedRoute>
          }
        />
        <Route
          path="/aprobaciones"
          element={
            <ProtectedRoute role="admin">
              <Aprobaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes/agregar"
          element={
            <ProtectedRoute role="admin">
              <AgregarCliente />
            </ProtectedRoute>
          }
        />

        {/* Cliente */}
        <Route
          path="/cliente/home"
          element={
            <ProtectedRoute role="cliente">
              <ClienteHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cliente/cuota"
          element={
            <ProtectedRoute role="cliente">
              <ClienteCuota />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cliente/progreso"
          element={
            <ProtectedRoute role="cliente">
              <ClienteProgreso />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cliente/sesiones"
          element={
            <ProtectedRoute role="cliente">
              <ClienteSesiones />
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
      <ClienteProvider>
        <AppContent />
      </ClienteProvider>
    </BrowserRouter>
  );
}
