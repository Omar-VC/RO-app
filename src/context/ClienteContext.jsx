
// src/context/ClienteContext.jsx
import { createContext, useContext, useState } from "react";

const ClienteContext = createContext();

export function ClienteProvider({ children }) {
  const [clienteSeleccionado, setClienteSeleccionadoState] = useState(() => {
    const guardado = localStorage.getItem("clienteSeleccionado");
    return guardado ? JSON.parse(guardado) : null;
  });

  const setClienteSeleccionado = (cliente) => {
    setClienteSeleccionadoState(cliente);
    if (cliente) {
      localStorage.setItem("clienteSeleccionado", JSON.stringify(cliente));
    } else {
      localStorage.removeItem("clienteSeleccionado");
    }
  };

  return (
    <ClienteContext.Provider value={{ clienteSeleccionado, setClienteSeleccionado }}>
      {children}
    </ClienteContext.Provider>
  );
}

export function useCliente() {
  return useContext(ClienteContext);
}
