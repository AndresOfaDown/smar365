import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";

// Asumo que tu modelo de Garantia tiene 'nombre' y 'descripcion'
// Si tiene 'duracion_meses' u otro campo, ajusta el formData y el formulario.
export const GarantiasPage = () => {
  const [garantias, setGarantias] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  // --- (Sin cambios aquí) ---
  const [formData, setFormData] = useState({
    producto: "", // ID del producto
    fecha_inicio: "",
    fecha_fin: "",
  });

  // --- CAMBIO: 'listar_garantias' devuelve un objeto con 'producto: nombre' ---
  const fetchGarantias = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/garantias/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGarantias(res.data); // res.data es la lista de garantías
    } catch (err) {
      console.error("Error al cargar garantías:", err);
      toast.error("No se pudieron cargar las garantías ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGarantias();
  }, [token]);

  // Manejador para el formulario (Sin cambios)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // --- CAMBIO: 'handleSubmit' ahora maneja la respuesta 'res.data.garantia' y los errores 400 ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataAEnviar = {
      producto: parseInt(formData.producto),
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin,
    };

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/garantias/crear/",
        dataAEnviar,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(res.data.mensaje || "Garantía creada ✅"); // Muestra el mensaje de la API
      
      // La API devuelve { mensaje: "...", garantia: {...} }
      // Añadimos solo el objeto 'garantia' a nuestra lista de estado
      setGarantias((prevGarantias) => [...prevGarantias, res.data.garantia]); 
      
      setFormData({ producto: "", fecha_inicio: "", fecha_fin: "" });
    } catch (err)
 {
      console.error("Error al crear garantía:", err);
      // --- MEJORA: Mostrar el error específico del backend ---
      if (err.response && err.response.data && err.response.data.error) {
        // Esto mostrará "Este producto ya tiene una garantía asignada."
        toast.error(`Error: ${err.response.data.error} ❌`);
      } else {
        toast.error("Error al crear la garantía ❌");
      }
    }
  };


  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Gestión de Garantías
      </h2>

      {/* --- Formulario (Sin cambios) --- */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-3">Crear y Asignar Garantía a Producto</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ID del Producto
            </label>
            <input
              type="number"
              name="producto"
              value={formData.producto}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
              placeholder="Ej: 5"
              required
            />
          </div>
          
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

          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <FaPlus /> Crear Garantía
          </button>
        </form>
      </div>

      {/* --- CAMBIO: Lista ahora muestra 'garantia.producto' (que es un nombre) --- */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-3">Garantías Existentes</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <ul className="space-y-2">
            {garantias.map((garantia) => (
              <li
                key={garantia.id}
                className="p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-800">
                  {garantia.producto} (Garantía ID: {garantia.id})
                </span>
                <p className="text-sm text-gray-600">
                  Válida de: {garantia.fecha_inicio} hasta {garantia.fecha_fin}
                </p> {/* <-- ¡ERROR CORREGIDO AQUÍ! Era </Vigente> */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};