import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBolt, FaEnvelope, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import { usuariosAPI } from "../../../data/sources/api";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await usuariosAPI.login(formData);
      
      // Guardar tokens y datos de usuario en localStorage
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));

      toast.success("¡Bienvenido! Iniciaste sesión correctamente");
      
      // Redirigir según el rol del usuario
      const rol = response.data.usuario.rol;
      if (rol === "ADMINISTRADOR" || rol === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/cliente/home");
      }
    } catch (error) {
      console.error("Error en login:", error);
      const errorMessage = error.response?.data?.error || "Error al iniciar sesión";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaBolt className="text-3xl text-yellow-400" />
            <h1 className="text-3xl font-extrabold text-gray-800">
              SmartSales<span className="text-blue-600">365</span>
            </h1>
          </div>
          <p className="text-gray-600">Inicia sesión en tu cuenta</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2 text-blue-600" />
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaLock className="inline mr-2 text-blue-600" />
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition duration-300 disabled:opacity-50"
            >
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Enlace a registro */}
          <div className="text-center mt-6 text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-semibold"
            >
              Regístrate aquí
            </Link>
          </div>

          {/* Enlace a home */}
          <div className="text-center mt-4 text-sm text-gray-600">
            <Link
              to="/"
              className="text-gray-500 hover:text-blue-600 transition"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
