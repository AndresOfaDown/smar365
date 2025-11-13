import { api } from '../api/axiosConfig';

// ========== PRODUCTOS ==========
export const listProductos = () => api.get("productos/");
export const getProducto = (id) => api.get(`productos/${id}/`);
export const createProducto = (data) => api.post("productos/crear/", data);
export const updateProducto = (id, data) => api.put(`productos/actualizar/${id}/`, data);
export const deleteProducto = (id) => api.delete(`productos/eliminar/${id}/`);
export const getCatalogo = () => api.get("catalogo/");
export const getProductosConDescuento = () => api.get("productos/con-descuento/");
export const getProductosSinGarantia = () => api.get("productos/sin-garantia/");
export const getRecomendaciones = () => api.get("recomendaciones/");

export default {
  listProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
  getCatalogo,
  getProductosConDescuento,
  getProductosSinGarantia,
  getRecomendaciones,
};
