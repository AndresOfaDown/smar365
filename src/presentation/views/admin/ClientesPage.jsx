import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom"; // <--- ¡Asegúrate de importar Link!
import { FaUsers } from "react-icons/fa";

export const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/clientes/", {
          headers: { 
           Authorization: `Bearer ${token}` },
        });
        setClientes(res.data); // Asumo que res.data es la lista
      } catch (err) {
        console.error("Error al cargar clientes:", err);
        toast.error("No se pudieron cargar los clientes ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [token]);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando clientes...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
          <FaUsers />
          Gestión de Clientes
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Nombre</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Teléfono</th>
              <th className="py-3 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {cliente.nombre} {cliente.apellido || ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.telefono || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  
                  {/* --- ¡AQUÍ ESTÁ LA CORRECCIÓN! --- */}
                  {/* 1. El texto dice "Ver Detalles" */}
                  {/* 2. El 'to' apunta a '/admin/clientes/detalles/' */}
                  <Link
                    to={`/admin/clientes/detalles/${cliente.id}`}
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