import { api } from '../api/axiosConfig';

// ========== CLIENTES ==========
export const listClientes = () => api.get("clientes/");
export const getCliente = (id) => api.get(`cliente/${id}/info/`);
export const updateCliente = (id, data) => api.put(`user/${id}/update/`, data);
export const deleteCliente = (id) => api.delete(`${id}/elimUser/`);

export default {
  listClientes,
  getCliente,
  updateCliente,
  deleteCliente,
};
