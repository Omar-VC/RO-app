import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UIButton from "../components/UIButton";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/"); // Redirige si el login fue exitoso
  } catch (error) {
    alert("Error al iniciar sesión: " + error.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white rounded shadow">
        <div className="text-center text-4xl font-semibold tracking-widest mb-6">R O</div>
        <form onSubmit={handleLogin} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2 mb-3"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2 mb-4"
          />
          <UIButton type="submit">Ingresar</UIButton>
        </form>
      </div>
    </div>
  );
}
