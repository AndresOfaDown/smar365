import { api } from '../api/axiosConfig';

// ========== VENTAS Y PAGOS ==========
export const crearPago = (data) => api.post("pago/crear/", data);
export const getMisNotas = () => api.get("notas/");
export const getNotaDetalle = (id) => api.get(`notas/${id}/`);
export const getNotaPDF = (id) => api.get(`notas/${id}/pdf/`, { responseType: 'blob' });
export const getHistorialCliente = (clienteId) => api.get(`historial/${clienteId}/`);

export default {
  crearPago,
  getMisNotas,
  getNotaDetalle,
  getNotaPDF,
  getHistorialCliente,
};
