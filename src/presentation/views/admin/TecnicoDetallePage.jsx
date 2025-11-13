import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";
import { FaEdit, FaHardHat } from "react-icons/fa";
import * as TecnicoService from "../../../Services/TecnicoService";

export const TecnicoDetallePage = () => {
  const { id } = useParams();
  const [tecnico, setTecnico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTecnico = async () => {
      setLoading(true);
      try {
        const res = await TecnicoService.getTecnico(id);
        setTecnico(res.data);
      } catch (err) {
        console.error("Error al cargar técnico:", err);
        if (err.response && err.response.status === 404) {
          setError("Técnico no encontrado.");
          toast.error("Técnico no encontrado ❌");
        } else {
          setError("Error al cargar el técnico.");
          toast.error("Error al cargar el técnico ❌");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTecnico();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando técnico...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 font-semibold">{error}</p>;
  }

  if (!tecnico) {
    return <p className="text-center text-gray-500">No se encontraron datos del técnico.</p>;
  }

  // Si todo está bien, muestra la información
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          Detalles del Técnico (ID: {tecnico.id || id})
        </h2>
        {/* Botón para ir a la página de EDICIÓN (que crearemos después) */}
        <Link
          to={`/admin/tecnicos/editar/${id}`}
          className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FaEdit />
          Editar Técnico
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-6 mb-8">
          <FaHardHat className="text-8xl text-gray-300" />
          <div>
            <h3 className="text-4xl font-bold text-gray-900">
              {tecnico.nombre} {tecnico.apellido || ""}
            </h3>
            <p className="text-xl text-gray-500">
              Técnico / Especialista
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Nombre Completo</dt>
              <dd className="mt-1 text-lg text-gray-900">{tecnico.nombre} {tecnico.apellido || ""}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-lg text-gray-900">{tecnico.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd className="mt-1 text-lg text-gray-900">{tecnico.telefono || "N/A"}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Especialidad</dt>
              <dd className="mt-1 text-lg text-gray-900">{tecnico.especialidad || "N/A"}</dd>
            </div>
            {/* Puedes añadir más campos aquí si los tienes */}
          </dl>
        </div>
      </div>
    </div>
  );
};