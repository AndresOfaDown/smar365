import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

export const ClienteEditarPage = () => {
  const { id } = useParams(); // Obtiene el ID del cliente de la URL
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    // Añade aquí otros campos que tenga tu modelo de Cliente
  });
  const [loading, setLoading] = useState(true);
  
  // --- NUEVO: Estado para la confirmación de borrado ---
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Cargar los datos del cliente
  useEffect(() => {
    const fetchCliente = async () => {
      setLoading(true);
      try {
        // --- RUTA CORREGIDA (GET) ---
        const res = await axios.get(`http://127.0.0.1:8000/api/cliente/${id}/info/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Cargar los datos en el formulario
        setFormData({
          nombre: res.data.nombre || "",
          apellido: res.data.apellido || "",
          email: res.data.email || "",
          telefono: res.data.telefono || "",
          // ... otros campos
        });

      } catch (err) {
        console.error("Error al cargar cliente:", err);
        toast.error("No se pudo cargar el cliente ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [id, token]);

  // Manejador para los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Enviar formulario (Guardar cambios)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // --- RUTA CORREGIDA (PUT) ---
      await axios.put(
        `http://127.0.0.1:8000/api/user/${id}/update/`,
        formData, // Envía todos los datos del formulario
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Cliente actualizado correctamente ✅");
      navigate("/admin/clientes"); // Redirige a la lista
    } catch (err) {
      console.error("Error al actualizar cliente:", err);
      toast.error(err.response?.data?.error || "Error al actualizar ❌");
    }
  };

  // --- NUEVA FUNCIÓN: Eliminar Cliente ---
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/${id}/elimUser/`, // Usando la ruta que me diste
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Cliente eliminado correctamente ✅");
      navigate("/admin/clientes"); // Redirige a la lista
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
      toast.error(err.response?.data?.error || "Error al eliminar ❌");
      setShowDeleteConfirm(false); // Ocultar confirmación si falla
    }
  };


  if (loading) {
    return <p className="text-center text-gray-500">Cargando cliente...</p>;
  }

  // Render del formulario
  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Editar Cliente (ID: {id})
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campo Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
              required
            />
          </div>
          {/* Campo Apellido */}
          
        </div>

        {/* Campo Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>

        {/* Campo Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
          />
        </div>

        {/* Botón de Guardar */}
        <button
          type="submit"
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Guardar Cambios
        </button>
      </form>

      {/* --- NUEVA SECCIÓN: ELIMINAR --- */}
      <div className="mt-8 border-t border-red-200 pt-6">
        <h3 className="text-lg font-semibold text-red-700">Zona de Peligro</h3>
        <p className="text-sm text-gray-600 mb-4">
          Esta acción no se puede deshacer.
        </p>
        
        {/* Mostrar el botón de confirmación si se ha hecho clic */}
        {showDeleteConfirm ? (
          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Sí, eliminar permanentemente
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Eliminar Cliente
          </button>
        )}
      </div>
    </div>
  );
};