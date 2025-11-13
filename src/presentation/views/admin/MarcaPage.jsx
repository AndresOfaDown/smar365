import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import * as MarcaService from "../../../Services/MarcaService";

export const MarcasPage = () => {
  const [marcas, setMarcas] = useState([]);
  const [nuevaMarca, setNuevaMarca] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar marcas existentes
  const fetchMarcas = async () => {
    setLoading(true);
    try {
      const res = await MarcaService.listMarcas();
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
      const res = await MarcaService.createMarca({ nombre: nuevaMarca });
      toast.success("Marca creada correctamente ✅");
      setMarcas([...marcas, res.data]);
      setNuevaMarca("");
    } catch (err) {
      console.error("Error al crear marca:", err);
      toast.error("Error al crear la marca ❌");
    }
  };

  // 🔹 Iniciar edición
  const handleEditStart = (marca) => {
    setEditingId(marca.id);
    setEditingName(marca.nombre);
  };

  // 🔹 Guardar edición
  const handleEditSave = async (id) => {
    if (!editingName.trim()) {
      toast.warning("El nombre no puede estar vacío ⚠️");
      return;
    }

    try {
      setMarcas(
        marcas.map((m) =>
          m.id === id ? { ...m, nombre: editingName } : m
        )
      );
      toast.success("Marca actualizada correctamente ✅");
      setEditingId(null);
      setEditingName("");
    } catch (err) {
      console.error("Error al editar marca:", err);
      toast.error("Error al editar la marca ❌");
    }
  };

  // 🔹 Cancelar edición
  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName("");
  };

  // 🔹 Eliminar marca
  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta marca?")) return;
    
    try {
      await MarcaService.deleteMarca(id);
      toast.success("Marca eliminada correctamente ✅");
      setMarcas(marcas.filter((marca) => marca.id !== id));
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
                <td className="py-2 px-4 font-medium">
                  {editingId === marca.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    marca.nombre
                  )}
                </td>
                <td className="py-2 px-4 text-center space-x-2">
                  {editingId === marca.id ? (
                    <>
                      <button
                        onClick={() => handleEditSave(marca.id)}
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
                        onClick={() => handleEditStart(marca)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(marca.id)}
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
