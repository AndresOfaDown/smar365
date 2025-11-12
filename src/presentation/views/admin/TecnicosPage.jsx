import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaHardHat } from "react-icons/fa"; // Un icono para técnicos

export const TecnicosPage = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchTecnicos = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/tecnicos/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTecnicos(res.data);
      } catch (err) {
        console.error("Error al cargar técnicos:", err);
        toast.error("No se pudieron cargar los técnicos ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchTecnicos();
  }, [token]);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando técnicos...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
          <FaHardHat />
          Gestión de Técnicos
        </h2>
        {/* Opcional: Botón para crear nuevo técnico
        <Link
          to="/admin/tecnicos/crear"
          className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Crear Técnico
        </Link>
        */}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              {/* Ajusta estos campos a tu modelo de Técnico */}
              <th className="py-3 px-6 text-left">Nombre</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Especialidad</th>
              <th className="py-3 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tecnicos.map((tecnico) => (
              <tr key={tecnico.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {tecnico.nombre} {tecnico.apellido || ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{tecnico.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{tecnico.especialidad || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <Link
                    to={`/admin/tecnicos/detalles/${tecnico.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ver Detalles
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};