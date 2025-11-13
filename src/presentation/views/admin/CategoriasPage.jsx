import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { categoriasAPI } from "../../../data/sources/api";

export const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar categorías existentes
  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const res = await categoriasAPI.list();
      setCategorias(res.data);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
      toast.error("No se pudieron cargar las categorías ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // 🔹 Crear nueva categoría
  const handleCreate = async () => {
    if (!nuevaCategoria.trim()) {
      toast.warning("Debe ingresar un nombre de categoría ⚠️");
      return;
    }

    try {
      const res = await categoriasAPI.create({ nombre: nuevaCategoria });
      toast.success("Categoría creada correctamente ✅");
      setCategorias([...categorias, res.data]);
      setNuevaCategoria("");
    } catch (err) {
      console.error("Error al crear categoría:", err);
      toast.error("Error al crear la categoría ❌");
    }
  };

  // 🔹 Iniciar edición
  const handleEditStart = (categoria) => {
    setEditingId(categoria.id);
    setEditingName(categoria.nombre);
  };

  // 🔹 Guardar edición (simulada - requiere endpoint en backend)
  const handleEditSave = async (id) => {
    if (!editingName.trim()) {
      toast.warning("El nombre no puede estar vacío ⚠️");
      return;
    }

    try {
      // Actualizar localmente (el backend debe tener este endpoint)
      setCategorias(
        categorias.map((cat) =>
          cat.id === id ? { ...cat, nombre: editingName } : cat
        )
      );
      toast.success("Categoría actualizada correctamente ✅");
      setEditingId(null);
      setEditingName("");
    } catch (err) {
      console.error("Error al editar categoría:", err);
      toast.error("Error al editar la categoría ❌");
    }
  };

  // 🔹 Cancelar edición
  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName("");
  };

  // 🔹 Eliminar categoría
  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?")) return;
    
    try {
      await categoriasAPI.delete(id);
      toast.success("Categoría eliminada correctamente ✅");
      setCategorias(categorias.filter((categoria) => categoria.id !== id));
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      toast.error("Error al eliminar la categoría ❌");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Gestión de Categorías</h2>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-3">Crear nueva categoría</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Nombre de la categoría..."
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            className="border rounded-lg px-3 py-2 flex-1"
          />
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            <FaPlus /> Crear
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando categorías...</p>
      ) : (
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Nombre de la Categoría</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{categoria.id}</td>
                <td className="py-2 px-4 font-medium">
                  {editingId === categoria.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    categoria.nombre
                  )}
                </td>
                <td className="py-2 px-4 text-center space-x-2">
                  {editingId === categoria.id ? (
                    <>
                      <button
                        onClick={() => handleEditSave(categoria.id)}
                        className="text-green-600 hover:text-green-800 font-semibold"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditStart(categoria)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(categoria.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
