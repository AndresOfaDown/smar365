import { api } from '../api/axiosConfig';

// ========== GARANTIAS ==========
export const listGarantias = () => api.get("garantias/");
export const createGarantia = (data) => api.post("garantias/crear/", data);
export const updateGarantia = (id, data) => api.put(`garantias/${id}/`, data);
export const deleteGarantia = (id) => api.delete(`garantias/eliminar/${id}/`);

export default {
  listGarantias,
  createGarantia,
  updateGarantia,
  deleteGarantia,
};
