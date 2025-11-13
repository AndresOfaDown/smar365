import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as AuthService from "../../../Services/AuthService";

export const LoginModal = ({ onClose, show }) => {
  if (!show) return null;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // ✅ Función para manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Función para enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await AuthService.login(formData);

      // Guardar tokens y usuario
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

      toast.success("Inicio de sesión exitoso ✅");

      const rol = (res.data.usuario?.rol || "").toUpperCase();
      console.log("ROL RECIBIDO:", rol);

      setTimeout(() => {
  const rolMayus = (res.data.usuario?.rol || "").toUpperCase();

  if (["ADMIN", "ADMINISTRADOR", "SUPERUSER","Administrador"].includes(rolMayus)) {
    navigate("/admin/dashboard");
  } else if (["CLIENTE", "USER", "USUARIO"].includes(rolMayus)) {
    navigate("/cliente/home");
  } else {
    toast.warn("Rol no reconocido ⚠️");
  }

  onClose();
}, 500);
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      toast.error("Credenciales incorrectas ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          X
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Correo</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange} // ✅ aquí se usa correctamente
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange} // ✅ igual aquí
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};
