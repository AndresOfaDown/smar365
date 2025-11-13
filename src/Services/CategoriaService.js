import { api } from '../api/axiosConfig';

// ========== CATEGORIAS ==========
export const listCategorias = () => api.get("categorias/");
export const createCategoria = (data) => api.post("categorias/crear/", data);
export const deleteCategoria = (id) => api.delete(`categoria/eliminar/${id}/`);

export default {
  listCategorias,
  createCategoria,
  deleteCategoria,
};
