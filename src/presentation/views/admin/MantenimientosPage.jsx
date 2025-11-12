import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTools } from "react-icons/fa";

export const MantenimientosPage = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [tecnicos, setTecnicos] = useState([]); // Estado para la lista de técnicos
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchData = async () => { // <--- La función se llama fetchData
      setLoading(true);
      try {
        const [mantenimientosRes, tecnicosRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/mantenimientos/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/api/tecnicos/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setMantenimientos(mantenimientosRes.data);
        setTecnicos(tecnicosRes.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        toast.error("No se pudieron cargar los datos ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // <--- CORRECCIÓN 1: La llamada ahora es 'fetchData()'
  }, [token]);

  // Función para manejar la asignación de técnico
  const handleAsignarTecnico = async (mantenimientoId, tecnicoId) => {
    const dataAEnviar = {
      // --- ¡CAMBIO AQUÍ! ---
      // Tu API (views.py L:26) espera la clave 'tecnico', no 'tecnico_id'
      tecnico: tecnicoId === "" ? null : parseInt(tecnicoId),
    };

    try {
      // --- CORRECCIÓN 2: Se cambió .post por .put para el error 405 ---
      const res = await axios.put(
        `http://127.0.0.1:8000/api/mantenimientos/${mantenimientoId}/asignar-tecnico/`,
        dataAEnviar,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizamos el estado local para que la UI refleje el cambio
      setMantenimientos((prevMantenimientos) =>
        prevMantenimientos.map((m) => {
          if (m.id === mantenimientoId) {
            // Asumo que la API devuelve el mantenimiento actualizado
            return res.data.mantenimiento || res.data; // Sé flexible con la respuesta
          }
          return m;
        })
      );

      toast.success("Técnico asignado correctamente ✅");
    } catch (err) {
      console.error("Error al asignar técnico:", err);
      toast.error(err.response?.data?.error || "Error al asignar técnico ❌");
    }
  };


  // Función para dar estilo al estado
  const getEstadoBadge = (estado) => {
    // Convertir a minúsculas y quitar espacios extra
    const estadoLimpio = String(estado).toLowerCase().trim();
    
    switch (estadoLimpio) {
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'en progreso':
        return 'bg-yellow-100 text-yellow-800';
      case 'pendiente':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando mantenimientos...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3 mb-6">
        <FaTools />
        Gestión de Mantenimientos
      </h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Producto</th>
              <th className="py-3 px-6 text-left">Técnico</th>
              <th className="py-3 px-6 text-left">Fecha de Servicio</th>
              <th className="py-3 px-6 text-left">Descripción</th>
              <th className="py-3 px-6 text-left">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mantenimientos.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {/* Asumo que la API devuelve 'producto_nombre' o 'producto.nombre' */}
                  {m.producto_nombre || m.producto?.nombre || m.producto || "N/A"}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    // Asumo que 'm.tecnico' es el ID o un objeto {id, nombre}
                    value={m.tecnico?.id || m.tecnico || ""} 
                    onChange={(e) => handleAsignarTecnico(m.id, e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg w-full bg-white"
                  >
                    <option value="">Sin Asignar</option>
                    {tecnicos.map((tecnico) => (
                      <option key={tecnico.id} value={tecnico.id}>
                        {tecnico.nombre} {tecnico.apellido || ""}
                      </option>
                    ))}
                  </select>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  {m.fecha_servicio ? new Date(m.fecha_servicio).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-normal max-w-sm">
                  {m.descripcion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getEstadoBadge(m.estado)}`}
                  >
                    {m.estado || "N/A"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};