import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";

export const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  // 🔹 Cargar categorías existentes
  const fetchCategorias = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/categorias/", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const res = await axios.post(
        "http://127.0.0.1:8000/api/categorias/crear/",
        { nombre: nuevaCategoria },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Categoría creada correctamente ✅");
      setCategorias([...categorias, res.data]); // Añadir la nueva categoría a la lista
      setNuevaCategoria("");
    } catch (err) {
      console.error("Error al crear categoría:", err);
      toast.error("Error al crear la categoría ❌");
    }
  };

  // 🔹 Eliminar categoría
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/categoria/eliminar/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Categoría eliminada correctamente ✅");
      setCategorias(categorias.filter((categoria) => categoria.id !== id)); // Eliminar de la lista
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
                <td className="py-2 px-4 font-medium">{categoria.nombre}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleDelete(categoria.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
