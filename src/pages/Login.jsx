
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UIButton from "../components/UIButton";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerData, setRegisterData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("⚠️ Error: verifica tu email o contraseña.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerData.email,
        registerData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        nombre: registerData.nombre,
        apellido: registerData.apellido,
        telefono: registerData.telefono,
        email: registerData.email,
        rol: "cliente", // Rol por defecto
      });

      alert("✅ Cuenta creada correctamente.");
      setIsRegistering(false);
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("⚠️ No se pudo crear la cuenta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        backgroundColor: "var(--color-fondo)",
        color: "var(--color-texto)",
      }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-2xl shadow-lg border mb-6"
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

        {!isRegistering ? (
          // === FORMULARIO DE LOGIN ===
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
        ) : (
          // === FORMULARIO DE REGISTRO ===
          <form onSubmit={handleRegister} className="flex flex-col">
            <input
              type="text"
              placeholder="Nombre"
              value={registerData.nombre}
              onChange={(e) =>
                setRegisterData({ ...registerData, nombre: e.target.value })
              }
              required
              className="p-3 mb-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--color-dorado)]"
              style={{
                backgroundColor: "var(--color-fondo)",
                color: "var(--color-texto)",
                borderColor: "var(--color-borde)",
              }}
            />
            <input
              type="text"
              placeholder="Apellido"
              value={registerData.apellido}
              onChange={(e) =>
                setRegisterData({ ...registerData, apellido: e.target.value })
              }
              required
              className="p-3 mb-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--color-dorado)]"
              style={{
                backgroundColor: "var(--color-fondo)",
                color: "var(--color-texto)",
                borderColor: "var(--color-borde)",
              }}
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={registerData.telefono}
              onChange={(e) =>
                setRegisterData({ ...registerData, telefono: e.target.value })
              }
              className="p-3 mb-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--color-dorado)]"
              style={{
                backgroundColor: "var(--color-fondo)",
                color: "var(--color-texto)",
                borderColor: "var(--color-borde)",
              }}
            />
            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              required
              className="p-3 mb-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--color-dorado)]"
              style={{
                backgroundColor: "var(--color-fondo)",
                color: "var(--color-texto)",
                borderColor: "var(--color-borde)",
              }}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              required
              className="p-3 mb-6 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--color-dorado)]"
              style={{
                backgroundColor: "var(--color-fondo)",
                color: "var(--color-texto)",
                borderColor: "var(--color-borde)",
              }}
            />
            <UIButton type="submit" variant="gold" disabled={loading}>
              {loading ? "Creando cuenta..." : "Registrarme"}
            </UIButton>
          </form>
        )}
      </div>

      <div className="text-center">
        {!isRegistering ? (
          <p>
            ¿No tenés cuenta?{" "}
            <button
              onClick={() => setIsRegistering(true)}
              className="text-[var(--color-dorado)] hover:underline"
            >
              Registrate
            </button>
          </p>
        ) : (
          <p>
            ¿Ya tenés cuenta?{" "}
            <button
              onClick={() => setIsRegistering(false)}
              className="text-[var(--color-dorado)] hover:underline"
            >
              Iniciá sesión
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
