import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCheckSquare, FaPlus } from "react-icons/fa";
import { rolesAPI, permisosAPI } from "../../../data/sources/api";

export const PermisosPage = () => {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [asignaciones, setAsignaciones] = useState([]);
  const [nuevoPermiso, setNuevoPermiso] = useState("");

  // 🔹 Cargar roles
  const fetchRoles = async () => {
    try {
      const res = await rolesAPI.list();
      setRoles(res.data);
    } catch (err) {
      toast.error("Error al cargar roles ❌");
    }
  };

  // 🔹 Cargar todos los permisos
  const fetchPermisos = async () => {
    try {
      const res = await permisosAPI.list();
      setPermisos(res.data);
    } catch (err) {
      toast.error("Error al cargar permisos ❌");
    }
  };

  // 🔹 Cargar permisos del rol seleccionado
  const fetchPermisosPorRol = async (rolId) => {
    try {
      const res = await permisosAPI.getByRole(rolId);
      setAsignaciones(res.data);
    } catch (err) {
      toast.error("Error al obtener permisos del rol ❌");
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermisos();
  }, []);

  useEffect(() => {
    if (rolSeleccionado) fetchPermisosPorRol(rolSeleccionado);
  }, [rolSeleccionado]);

  // 🔹 Crear nuevo permiso global
  const handleCreatePermiso = async () => {
    if (!nuevoPermiso.trim()) {
      toast.warning("Debe ingresar un nombre de permiso ⚠️");
      return;
    }
    try {
      await permisosAPI.create({ nombre: nuevoPermiso });
      toast.success("Permiso creado correctamente ✅");
      setNuevoPermiso("");
      fetchPermisos();
    } catch (err) {
      toast.error("Error al crear permiso ❌");
    }
  };

  // 🔹 Cambiar estado de permiso (toggle)
  const handleToggle = async (permisoId, estadoActual) => {
    try {
      const payload = {
        rol_id: rolSeleccionado,
        permisos: [{ permiso_id: permisoId, estado: !estadoActual }],
      };

      await permisosAPI.updateRolePermissions(payload);

      toast.info("Estado del permiso actualizado ✅");
      fetchPermisosPorRol(rolSeleccionado);
    } catch (err) {
      toast.error("Error al actualizar permiso ❌");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Gestión de Permisos
      </h2>

      {/* 🔹 Selección de rol */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-700 font-medium">
          Seleccionar Rol
        </label>
        <select
          value={rolSeleccionado || ""}
          onChange={(e) => setRolSeleccionado(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full max-w-md"
        >
          <option value="">-- Selecciona un rol --</option>
          {roles.map((rol) => (
            <option key={rol.id} value={rol.id}>
              {rol.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Crear nuevo permiso global */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Nombre del nuevo permiso..."
          value={nuevoPermiso}
          onChange={(e) => setNuevoPermiso(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <button
          onClick={handleCreatePermiso}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <FaPlus /> Crear permiso
        </button>
      </div>

      {/* 🔹 Tabla de permisos */}
      {rolSeleccionado ? (
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Permiso</th>
              <th className="py-2 px-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {asignaciones.map((p) => (
              <tr key={p.permiso_id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{p.permiso_nombre}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleToggle(p.permiso_id, p.estado)}
                    className={`px-3 py-1 rounded-md text-white ${
                      p.estado ? "bg-green-600" : "bg-red-500"
                    }`}
                  >
                    {p.estado ? "Activo" : "Inactivo"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">Seleccione un rol para ver sus permisos.</p>
      )}
    </div>
  );
};
