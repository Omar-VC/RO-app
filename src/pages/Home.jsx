import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react"; // ícono de usuarios

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-2">Bienvenido a <span className="text-blue-600">RO App</span></h1>
      <p className="text-gray-600 mb-8">Gestión de clientes y entrenamientos</p>

      <div
        onClick={() => navigate("/clientes")}
        className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg cursor-pointer transition transform hover:-translate-y-1"
      >
        <Users size={60} className="text-blue-600 mb-3" />
        <span className="text-lg font-semibold text-gray-800">Clientes</span>
      </div>
    </div>
  );
}
