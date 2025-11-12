import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

export const MarcasPage = () => {
  const [marcas, setMarcas] = useState([]);
  const [nuevaMarca, setNuevaMarca] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  // 🔹 Cargar marcas existentes
  const fetchMarcas = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/marcas/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMarcas(res.data);
    } catch (err) {
      console.error("Error al cargar marcas:", err);
      toast.error("No se pudieron cargar las marcas ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  // 🔹 Crear nueva marca
  const handleCreate = async () => {
    if (!nuevaMarca.trim()) {
      toast.warning("Debe ingresar el nombre de la marca ⚠️");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/marcas/crear/",
        { nombre: nuevaMarca },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Marca creada correctamente ✅");
      setMarcas([...marcas, res.data]);
      setNuevaMarca("");
    } catch (err) {
      console.error("Error al crear marca:", err);
      toast.error("Error al crear la marca ❌");
    }
  };

  // 🔹 Eliminar marca
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/marcas/eliminar/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Marca eliminada correctamente ✅");
      setMarcas(marcas.filter((marca) => marca.id !== id)); // Eliminar de la lista
    } catch (err) {
      console.error("Error al eliminar marca:", err);
      toast.error("Error al eliminar la marca ❌");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Gestión de Marcas</h2>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-3">Crear nueva marca</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Nombre de la marca..."
            value={nuevaMarca}
            onChange={(e) => setNuevaMarca(e.target.value)}
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
        <p className="text-gray-500">Cargando marcas...</p>
      ) : (
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Nombre de la Marca</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {marcas.map((marca) => (
              <tr key={marca.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{marca.id}</td>
                <td className="py-2 px-4 font-medium">{marca.nombre}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleDelete(marca.id)}
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
