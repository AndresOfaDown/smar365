import { api } from '../api/axiosConfig';

// ========== TECNICOS ==========
export const listTecnicos = () => api.get("tecnicos/");
export const getTecnico = (id) => api.get(`tecnicos/${id}/info/`);
export const createTecnico = (data) => api.post("tecnicos/crear/", data);
export const updateTecnico = (id, data) => api.put(`tecnico/${id}/update/`, data);
export const deleteTecnico = (id) => api.delete(`tecnico/${id}/eliminar/`);

export default {
  listTecnicos,
  getTecnico,
  createTecnico,
  updateTecnico,
  deleteTecnico,
};
