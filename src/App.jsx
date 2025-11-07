import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import FichaCliente from "./pages/FichaCliente";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Cuotas from "./pages/Cuotas";
import Progreso from "./pages/Progreso"; 



export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cuotas" element={<Cuotas />} />
        <Route path="/progreso/:id" element={<Progreso />} />
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
  path="/progreso"
  element={
    <ProtectedRoute>
      <Progreso />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}
