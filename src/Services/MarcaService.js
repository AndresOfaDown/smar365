import { api } from '../api/axiosConfig';

// ========== MARCAS ==========
export const listMarcas = () => api.get("marcas/");
export const createMarca = (data) => api.post("marcas/crear/", data);
export const deleteMarca = (id) => api.delete(`marcas/eliminar/${id}/`);

export default {
  listMarcas,
  createMarca,
  deleteMarca,
};
