import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBolt, FaEnvelope, FaLock, FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { usuariosAPI, rolesAPI } from "../../../data/sources/api";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
    rol: 2, // Por defecto Cliente
  });

  // Cargar roles al montar
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await rolesAPI.list();
        setRoles(response.data);
      } catch (error) {
        console.error("Error cargando roles:", error);
        // Si falla, usar roles por defecto
        setRoles([
          { id: 2, nombre: "Cliente" },
          { id: 3, nombre: "Técnico" },
        ]);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rol" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await usuariosAPI.create(formData);

      toast.success("¡Registro exitoso! Redirigiendo a login...");

      // Redirigir a login después de 1.5 segundos
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Error en registro:", error);
      
      // Manejar errores específicos del backend
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Si es un objeto con errores de campos
        if (typeof errorData === "object") {
          Object.values(errorData).forEach((msg) => {
            if (Array.isArray(msg)) {
              msg.forEach((m) => toast.error(m));
            } else {
              toast.error(msg);
            }
          });
        } else {
          toast.error(errorData.mensaje || "Error al registrarse");
        }
      } else {
        toast.error("Error al registrarse. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaBolt className="text-3xl text-yellow-400" />
            <h1 className="text-3xl font-extrabold text-gray-800">
              SmartSales<span className="text-blue-600">365</span>
            </h1>
          </div>
          <p className="text-gray-600">Crea tu cuenta y comienza ahora</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaUser className="inline mr-2 text-blue-600" />
                Nombre completo
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Tu nombre"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition text-sm"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaPhone className="inline mr-2 text-blue-600" />
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+1234567890"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition text-sm"
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaMapMarkerAlt className="inline mr-2 text-blue-600" />
                Dirección (opcional)
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Tu dirección"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition text-sm"
              />
            </div>

            {/* Rol */}
            {roles.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de cuenta
                </label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition text-sm"
                >
                  {roles
                    .filter((role) => role.id !== 1) // Excluir Admin
                    .map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.nombre}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition duration-300 disabled:opacity-50 mt-6"
            >
              {loading ? "Registrando..." : "Crear Cuenta"}
            </button>
          </form>

          {/* Enlace a login */}
          <div className="text-center mt-6 text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Inicia sesión
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
