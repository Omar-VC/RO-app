import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UIButton from "../components/UIButton";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Evita doble clic
    if (loading) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirige si el login fue exitoso
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("⚠️ Error: verifica tu email o contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "var(--color-fondo)",
        color: "var(--color-texto)",
      }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-2xl shadow-lg border"
        style={{
          backgroundColor: "var(--color-card)",
          borderColor: "var(--color-borde)",
        }}
      >
        <div
          className="text-center text-4xl font-semibold tracking-widest mb-8"
          style={{ color: "var(--color-dorado)" }}
        >
          R O
        </div>

        <form onSubmit={handleLogin} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 mb-4 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--color-dorado)]"
            style={{
              backgroundColor: "var(--color-fondo)",
              color: "var(--color-texto)",
              borderColor: "var(--color-borde)",
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 mb-6 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--color-dorado)]"
            style={{
              backgroundColor: "var(--color-fondo)",
              color: "var(--color-texto)",
              borderColor: "var(--color-borde)",
            }}
          />

          <UIButton type="submit" variant="gold" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </UIButton>
        </form>
      </div>
    </div>
  );
}
