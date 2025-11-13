import { api } from '../api/axiosConfig';

// ========== ROLES ==========
export const listRoles = () => api.get("rol/");
export const createRol = (data) => api.post("rol/crear/", data);
export const deleteRol = (id) => api.delete(`rol/eliminar/${id}/`);

export default {
  listRoles,
  createRol,
  deleteRol,
};
