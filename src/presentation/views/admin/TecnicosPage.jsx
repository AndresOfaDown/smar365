import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaHardHat, FaPlus, FaTrash } from "react-icons/fa";
import * as TecnicoService from "../../../Services/TecnicoService";

export const TecnicosPage = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    especialidad: "",
  });

  useEffect(() => {
    const fetchTecnicos = async () => {
      setLoading(true);
      try {
        const res = await TecnicoService.listTecnicos();
        setTecnicos(res.data);
      } catch (err) {
        console.error("Error al cargar técnicos:", err);
        toast.error("No se pudieron cargar los técnicos ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchTecnicos();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.email.trim()) {
      toast.warning("Nombre y email son requeridos ⚠️");
      return;
    }

    try {
      const res = await TecnicoService.createTecnico(formData);
      setTecnicos([...tecnicos, res.data]);
      toast.success("Técnico creado correctamente ✅");
      setFormData({ nombre: "", apellido: "", email: "", especialidad: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error al crear técnico:", err);
      toast.error("Error al crear el técnico ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este técnico?")) return;

    try {
      await TecnicoService.deleteTecnico(id);
      setTecnicos(tecnicos.filter((t) => t.id !== id));
      toast.success("Técnico eliminado correctamente ✅");
    } catch (err) {
      console.error("Error al eliminar técnico:", err);
      toast.error("Error al eliminar el técnico ❌");
    }
  };

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
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <FaPlus /> Crear Técnico
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Crear nuevo técnico</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre *"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Especialidad"
              value={formData.especialidad}
              onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <div className="col-span-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ nombre: "", apellido: "", email: "", especialidad: "" });
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center space-x-2">
                  <Link
                    to={`/admin/tecnicos/detalles/${tecnico.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ver Detalles
                  </Link>
                  <button
                    onClick={() => handleDelete(tecnico.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};