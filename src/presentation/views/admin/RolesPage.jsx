import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { rolesAPI } from "../../../data/sources/api";

export const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [nuevoRol, setNuevoRol] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // 🔹 Cargar roles existentes
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await rolesAPI.list();
      setRoles(res.data);
    } catch (err) {
      console.error("Error al cargar roles:", err);
      toast.error("No se pudieron cargar los roles ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // 🔹 Crear nuevo rol
  const handleCreate = async () => {
    if (!nuevoRol.trim()) {
      toast.warning("Debe ingresar un nombre de rol ⚠️");
      return;
    }

    try {
      const res = await rolesAPI.create({ nombre: nuevoRol });
      toast.success("Rol creado correctamente ✅");
      setRoles([...roles, res.data]);
      setNuevoRol("");
    } catch (err) {
      console.error("Error al crear rol:", err);
      toast.error("Error al crear el rol ❌");
    }
  };

  // 🔹 Iniciar edición
  const handleEditStart = (rol) => {
    setEditingId(rol.id);
    setEditingName(rol.nombre);
  };

  // 🔹 Guardar edición
  const handleEditSave = async (id) => {
    if (!editingName.trim()) {
      toast.warning("El nombre no puede estar vacío ⚠️");
      return;
    }

    try {
      setRoles(
        roles.map((r) =>
          r.id === id ? { ...r, nombre: editingName } : r
        )
      );
      toast.success("Rol actualizado correctamente ✅");
      setEditingId(null);
      setEditingName("");
    } catch (err) {
      console.error("Error al editar rol:", err);
      toast.error("Error al editar el rol ❌");
    }
  };

  // 🔹 Cancelar edición
  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName("");
  };

  // 🔹 Eliminar rol
  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este rol?")) return;

    try {
      await rolesAPI.delete(id);
      setRoles(roles.filter((rol) => rol.id !== id));
      toast.success("Rol eliminado correctamente ✅");
    } catch (err) {
      console.error("Error al eliminar rol:", err);
      toast.error("Error al eliminar el rol ❌");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Gestión de Roles</h2>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-3">Crear nuevo rol</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Nombre del rol..."
            value={nuevoRol}
            onChange={(e) => setNuevoRol(e.target.value)}
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
        <p className="text-gray-500">Cargando roles...</p>
      ) : (
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Nombre del Rol</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((rol) => (
              <tr key={rol.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{rol.id}</td>
                <td className="py-2 px-4 font-medium">
                  {editingId === rol.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    rol.nombre
                  )}
                </td>
                <td className="py-2 px-4 text-center space-x-2">
                  {editingId === rol.id ? (
                    <>
                      <button
                        onClick={() => handleEditSave(rol.id)}
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
                        onClick={() => handleEditStart(rol)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(rol.id)}
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
