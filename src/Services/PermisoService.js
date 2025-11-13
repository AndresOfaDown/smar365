import { api } from '../api/axiosConfig';

// ========== PERMISOS ==========
export const listPermisos = () => api.get("permisos/");
export const createPermiso = (data) => api.post("permisos/crear/", data);
export const deletePermiso = (id) => api.delete(`permisos/eliminar/${id}/`);
export const getPermisosByRole = (rolId) => api.get(`${rolId}/rol_id/rolP/`);
export const updateRolePermissions = (data) => api.put("actP/", data);
export const asignarPermisos = (data) => api.post("permisos/asignar/", data);

export default {
  listPermisos,
  createPermiso,
  deletePermiso,
  getPermisosByRole,
  updateRolePermissions,
  asignarPermisos,
};
