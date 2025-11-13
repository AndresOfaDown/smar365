import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import * as ClienteService from "../../../Services/ClienteService";

export const ClienteDetallePage = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCliente();
  }, [id]);

  const fetchCliente = async () => {
    setLoading(true);
    try {
      const res = await ClienteService.getCliente(id);
      setCliente(res.data);
    } catch (err) {
      console.error("Error al cargar cliente:", err);
      if (err.response && err.response.status === 404) {
        setError("Cliente no encontrado.");
        toast.error("Cliente no encontrado ❌");
      } else {
        setError("Error al cargar el cliente.");
        toast.error("Error al cargar el cliente ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando cliente...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 font-semibold">{error}</p>;
  }

  if (!cliente) {
    return <p className="text-center text-gray-500">No se encontraron datos del cliente.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          Detalles del Cliente (ID: {cliente.id || id})
        </h2>
        <Link
          to={`/admin/clientes/editar/${id}`}
          className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FaEdit />
          Editar Cliente
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-6 mb-8">
          <FaUserCircle className="text-8xl text-gray-300" />
          <div>
            <h3 className="text-4xl font-bold text-gray-900">
              {cliente.nombre} {cliente.apellido || ""}
            </h3>
            <p className="text-xl text-gray-500">Cliente</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Nombre Completo</dt>
              <dd className="mt-1 text-lg text-gray-900">
                {cliente.nombre} {cliente.apellido || ""}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-lg text-gray-900">{cliente.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd className="mt-1 text-lg text-gray-900">{cliente.telefono || "N/A"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};