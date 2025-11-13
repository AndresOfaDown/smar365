import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { garantiasAPI } from "../../../data/sources/api";

export const GarantiasPage = () => {
  const [garantias, setGarantias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    duracion_meses: "",
  });

  // Cargar garantías
  const fetchGarantias = async () => {
    setLoading(true);
    try {
      const res = await garantiasAPI.list();
      setGarantias(res.data);
    } catch (err) {
      console.error("Error al cargar garantías:", err);
      toast.error("No se pudieron cargar las garantías ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGarantias();
  }, []);

  // Manejador para el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Crear o actualizar garantía
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.duracion_meses) {
      toast.warning("Complete los campos requeridos ⚠️");
      return;
    }

    const dataAEnviar = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      duracion_meses: parseInt(formData.duracion_meses),
    };

    try {
      if (editingId) {
        // Actualizar
        await garantiasAPI.update(editingId, dataAEnviar);
        setGarantias(
          garantias.map((g) =>
            g.id === editingId ? { ...g, ...dataAEnviar } : g
          )
        );
        toast.success("Garantía actualizada correctamente ✅");
        setEditingId(null);
      } else {
        // Crear
        const res = await garantiasAPI.create(dataAEnviar);
        setGarantias([...garantias, res.data]);
        toast.success("Garantía creada correctamente ✅");
      }

      setFormData({
        nombre: "",
        descripcion: "",
        duracion_meses: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Error al guardar la garantía ❌");
    }
  };

  // Editar garantía
  const handleEdit = (garantia) => {
    setEditingId(garantia.id);
    setFormData({
      nombre: garantia.nombre,
      descripcion: garantia.descripcion || "",
      duracion_meses: garantia.duracion_meses || "",
    });
    setShowForm(true);
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      nombre: "",
      descripcion: "",
      duracion_meses: "",
    });
  };

  // Eliminar garantía
  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta garantía?")) return;

    try {
      await garantiasAPI.delete(id);
      setGarantias(garantias.filter((g) => g.id !== id));
      toast.success("Garantía eliminada correctamente ✅");
    } catch (err) {
      console.error("Error al eliminar garantía:", err);
      toast.error("Error al eliminar la garantía ❌");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Gestión de Garantías</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <FaPlus /> Crear Garantía
        </button>
      </div>

      {/* Formulario para Crear/Editar Garantía */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-3">
            {editingId ? "Editar garantía" : "Crear nueva garantía"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de la Garantía
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
                  placeholder="Ej: Garantía Básica"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duración (meses)
                </label>
                <input
                  type="number"
                  name="duracion_meses"
                  value={formData.duracion_meses}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
                  placeholder="Ej: 12"
                  min="1"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
                placeholder="Detalle la cobertura de la garantía"
                rows="3"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                {editingId ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Garantías */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-3">Garantías Existentes</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : garantias.length === 0 ? (
          <p className="text-gray-500">No hay garantías creadas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-2 px-4 text-left">Nombre</th>
                  <th className="py-2 px-4 text-left">Duración</th>
                  <th className="py-2 px-4 text-left">Descripción</th>
                  <th className="py-2 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {garantias.map((garantia) => (
                  <tr key={garantia.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">{garantia.nombre}</td>
                    <td className="py-2 px-4">{garantia.duracion_meses} meses</td>
                    <td className="py-2 px-4 text-sm">{garantia.descripcion || "-"}</td>
                    <td className="py-2 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(garantia)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(garantia.id)}
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
        )}
      </div>
    </div>
  );
};