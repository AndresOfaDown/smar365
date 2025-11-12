import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";

export const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [nuevoRol, setNuevoRol] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  // 🔹 Cargar roles existentes
  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/rol/", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const res = await axios.post(
        "http://127.0.0.1:8000/api/permisos/crear/",
        { nombre: nuevoRol },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Rol creado correctamente ✅");
      setRoles([...roles, res.data.permiso]); // usa “permiso” porque el endpoint es de permisos/rol
      setNuevoRol("");
    } catch (err) {
      console.error("Error al crear rol:", err);
      toast.error("Error al crear el rol ❌");
    }
  };

  // 🔹 Eliminar rol (si tuvieras endpoint, se implementa aquí)
  const handleDelete = (id) => {
    toast.info(`(Demo) Aquí iría la eliminación del rol con ID ${id}`);
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
                <td className="py-2 px-4 font-medium">{rol.nombre}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleDelete(rol.id)}
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
