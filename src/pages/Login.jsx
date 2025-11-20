// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UIButton from "../components/UIButton";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

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
  const { login } = useAuth();

  // === LOGIN ===
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, "usuarios", uid));

      if (!userDoc.exists()) {
        alert("⚠️ Tu cuenta no está registrada correctamente en la base de datos.");
        return;
      }

      const userData = userDoc.data();

      if (userData.estado !== "aprobado") {
        alert("⚠️ Tu cuenta aún no fue aprobada por el administrador.");
        return;
      }

      // 👉 Guardar en contexto y localStorage con rol normalizado
      const fullUser = { uid, ...userData, rol: userData.rol.toLowerCase() };
      login(fullUser);
      localStorage.setItem("currentUser", JSON.stringify(fullUser));

      console.log("ROL GUARDADO:", fullUser.rol);

      // 👉 Redirección según rol
      if (fullUser.rol === "cliente") {
        navigate("/cliente/home");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("⚠️ Error: verifica tu email o contraseña.");
    } finally {
      setLoading(false);
    }
  };

  // === REGISTRO ===
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
        rol: "cliente",
        estado: "pendiente",
        creadoEn: new Date().toISOString(),
      });

      alert("✅ Registro enviado. Esperá la aprobación del administrador.");
      setIsRegistering(false);
    } catch (error) {
      console.error("Error al registrar:", error);
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("⚠️ Este correo ya está registrado.");
          break;
        case "auth/invalid-email":
          alert("⚠️ El correo es inválido.");
          break;
        case "auth/weak-password":
          alert("⚠️ La contraseña es muy débil.");
          break;
        default:
          alert("⚠️ No se pudo crear la cuenta.");
      }
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
          <form onSubmit={handleRegister} className="flex flex-col">
            {/* Campos de registro */}
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
            {/* ... resto de inputs igual que antes ... */}
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
