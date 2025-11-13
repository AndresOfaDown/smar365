import { api } from '../api/axiosConfig';

// ========== DESCUENTOS ==========
export const listDescuentos = () => api.get("descuentos/");
export const createDescuento = (data) => api.post("descuentos/crear/", data);
export const updateDescuento = (id, data) => api.put(`descuentos/${id}/`, data);
export const deleteDescuento = (id) => api.delete(`descuentos/eliminar/${id}/`);
export const asignarDescuento = (id, data) => api.post(`descuentos/asignar-descuento/${id}/`, data);

export default {
  listDescuentos,
  createDescuento,
  updateDescuento,
  deleteDescuento,
  asignarDescuento,
};
