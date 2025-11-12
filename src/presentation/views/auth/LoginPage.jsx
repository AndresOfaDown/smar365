import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/login", formData);

      // Guarda el token (si lo devuelve tu API)
      if (res.data.access || res.data.token) {
        localStorage.setItem("token", res.data.access || res.data.token);
        toast.success("Inicio de sesión exitoso ✅");
        navigate("/");
      } else {
        toast.info("Sesión iniciada sin token");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Credenciales incorrectas ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-700">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};
