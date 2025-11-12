import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";

export const DescuentosPage = () => {
  const [descuentos, setDescuentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  // --- CAMBIO: Añadidas fechas al estado ---
  const [formData, setFormData] = useState({
    nombre: "",
    porcentaje: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  // Cargar la lista de descuentos
  const fetchDescuentos = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/descuentos/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDescuentos(res.data);
    } catch (err) {
      console.error("Error al cargar descuentos:", err);
      toast.error("No se pudieron cargar los descuentos ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDescuentos();
  }, [token]);

  // Manejador para el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Enviar el formulario para crear
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convertir porcentaje a número y enviar todos los datos
    const dataAEnviar = {
      ...formData,
      porcentaje: parseFloat(formData.porcentaje)
    };

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/descuentos/crear/",
        dataAEnviar, // <-- CAMBIO: Ahora envía las fechas
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Descuento creado correctamente ✅");
      setDescuentos((prevDescuentos) => [...prevDescuentos, res.data]);
      // Limpiar formulario (incluyendo fechas)
      setFormData({ nombre: "", porcentaje: "", fecha_inicio: "", fecha_fin: "" });
    } catch (err) {
      console.error("Error al crear descuento:", err);
      toast.error("Error al crear el descuento ❌");
    }
  };


  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Gestión de Descuentos
      </h2>

      {/* --- Formulario para Crear Descuento --- */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-3">Crear nuevo descuento</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* --- CAMBIO: Formulario ahora en Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre del Descuento
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Porcentaje (ej: 15)
              </label>
              <input
                type="number"
                name="porcentaje"
                value={formData.porcentaje}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
                step="0.01"
                min="0"
                max="100"
                required
              />
            </div>
            {/* --- CAMBIO: Campo Fecha Inicio --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha de Inicio
              </label>
              <input
                type="date"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
                required
              />
            </div>
            {/* --- CAMBIO: Campo Fecha Fin --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha de Fin
              </label>
              <input
                type="date"
                name="fecha_fin"
                value={formData.fecha_fin}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <FaPlus /> Crear Descuento
          </button>
        </form>
      </div>

      {/* --- Lista de Descuentos Existentes (Actualizada) --- */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-3">Descuentos Existentes</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <ul className="space-y-2">
            {descuentos.map((descuento) => (
              <li
                key={descuento.id}
                className="flex flex-wrap justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <span className="font-medium text-gray-800">{descuento.nombre}</span>
                  <span className="ml-4 text-sm text-gray-500">
                    ({descuento.fecha_inicio} al {descuento.fecha_fin})
                  </span>
                </div>
                <span className="font-bold text-green-600">{descuento.porcentaje}% OFF</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};