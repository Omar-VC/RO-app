import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { crearUsuario } from "../firebase/usuarios";
import UIButton from "../components/UIButton";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validación de número de celular
    if (!/^[0-9]{8,15}$/.test(celular)) {
      alert("Por favor ingrese un número de celular válido (solo números).");
      return;
    }

    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Guardar datos adicionales en Firestore
      await crearUsuario({
        uid: userCredential.user.uid,
        nombre,
        celular,
        email,
        rol: "cliente",
        estado: "pendiente", // 🔒 El admin deberá aprobarlo
        creadoEn: new Date().toISOString(),
      });

      alert("Registro enviado. Tu cuenta será activada por el administrador.");
      navigate("/login");
    } catch (error) {
      alert("Error al registrar usuario: " + error.message);
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
          Crear cuenta
        </div>

        <form onSubmit={handleRegister} className="flex flex-col">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="p-3 mb-4 rounded-md border focus:outline-none"
            style={{
              backgroundColor: "var(--color-fondo)",
              color: "var(--color-texto)",
              borderColor: "var(--color-borde)",
            }}
            required
          />

          <input
            type="tel"
            placeholder="Número de celular"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            className="p-3 mb-4 rounded-md border focus:outline-none"
            style={{
              backgroundColor: "var(--color-fondo)",
              color: "var(--color-texto)",
              borderColor: "var(--color-borde)",
            }}
            required
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 mb-4 rounded-md border focus:outline-none"
            style={{
              backgroundColor: "var(--color-fondo)",
              color: "var(--color-texto)",
              borderColor: "var(--color-borde)",
            }}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 mb-6 rounded-md border focus:outline-none"
            style={{
              backgroundColor: "var(--color-fondo)",
              color: "var(--color-texto)",
              borderColor: "var(--color-borde)",
            }}
            required
          />

          <UIButton type="submit" variant="gold">
            Registrarme
          </UIButton>

          <p className="text-center mt-4 text-sm">
            ¿Ya tenés una cuenta?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="hover:underline"
              style={{ color: "var(--color-dorado)" }}
            >
              Iniciar sesión
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
