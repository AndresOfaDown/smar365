import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { descuentosAPI } from "../../../data/sources/api";

export const DescuentosPage = () => {
  const [descuentos, setDescuentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

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
      const res = await descuentosAPI.list();
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
  }, []);

  // Manejador para el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Enviar el formulario para crear o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.porcentaje || !formData.fecha_inicio || !formData.fecha_fin) {
      toast.warning("Complete todos los campos requeridos ⚠️");
      return;
    }

    const dataAEnviar = {
      ...formData,
      porcentaje: parseFloat(formData.porcentaje),
    };

    try {
      if (editingId) {
        // Actualizar
        await descuentosAPI.update(editingId, dataAEnviar);
        setDescuentos(
          descuentos.map((d) =>
            d.id === editingId ? { ...d, ...dataAEnviar } : d
          )
        );
        toast.success("Descuento actualizado correctamente ✅");
        setEditingId(null);
      } else {
        // Crear
        const res = await descuentosAPI.create(dataAEnviar);
        setDescuentos([...descuentos, res.data]);
        toast.success("Descuento creado correctamente ✅");
      }
      
      setFormData({
        nombre: "",
        porcentaje: "",
        fecha_inicio: "",
        fecha_fin: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Error al guardar el descuento ❌");
    }
  };

  // Editar descuento
  const handleEdit = (descuento) => {
    setEditingId(descuento.id);
    setFormData({
      nombre: descuento.nombre,
      porcentaje: descuento.porcentaje,
      fecha_inicio: descuento.fecha_inicio,
      fecha_fin: descuento.fecha_fin,
    });
    setShowForm(true);
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      nombre: "",
      porcentaje: "",
      fecha_inicio: "",
      fecha_fin: "",
    });
  };

  // Eliminar descuento
  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este descuento?")) return;
    
    try {
      await descuentosAPI.delete(id);
      setDescuentos(descuentos.filter((d) => d.id !== id));
      toast.success("Descuento eliminado correctamente ✅");
    } catch (err) {
      console.error("Error al eliminar descuento:", err);
      toast.error("Error al eliminar el descuento ❌");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Gestión de Descuentos</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <FaPlus /> Crear Descuento
        </button>
      </div>

      {/* Formulario para Crear/Editar Descuento */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-3">
            {editingId ? "Editar descuento" : "Crear nuevo descuento"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
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

      {/* Lista de Descuentos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-3">Descuentos Existentes</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : descuentos.length === 0 ? (
          <p className="text-gray-500">No hay descuentos creados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-2 px-4 text-left">Nombre</th>
                  <th className="py-2 px-4 text-left">Porcentaje</th>
                  <th className="py-2 px-4 text-left">Inicio</th>
                  <th className="py-2 px-4 text-left">Fin</th>
                  <th className="py-2 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {descuentos.map((descuento) => (
                  <tr key={descuento.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">{descuento.nombre}</td>
                    <td className="py-2 px-4 font-bold text-green-600">
                      {descuento.porcentaje}% OFF
                    </td>
                    <td className="py-2 px-4">{descuento.fecha_inicio}</td>
                    <td className="py-2 px-4">{descuento.fecha_fin}</td>
                    <td className="py-2 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(descuento)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(descuento.id)}
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