import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/";

// Crear instancia de axios con configuración base
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para agregar token en las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========== AUTENTICACIÓN ==========
export const authAPI = {
  login: (data) => api.post("login/", data),
  register: (data) => api.post("registro/", data),
  refreshToken: (refreshToken) => api.post("api/token/refresh/", { refresh: refreshToken }),
};

// ========== USUARIOS ==========
export const usuariosAPI = {
  list: () => api.get("getUser/"),
  login: (data) => api.post("login/", data),
  create: (data) => api.post("registro/", data),
  update: (id, data) => api.put(`user/${id}/update/`, data),
  delete: (id) => api.delete(`${id}/elimUser/`),
  getProfile: () => api.get("perfil/me/"),
  updateProfile: (data) => api.put("user/editar/", data),
  getInfo: () => api.get("user/info/"),
};

// ========== PRODUCTOS ==========
export const productosAPI = {
  list: () => api.get("productos/"),
  get: (id) => api.get(`productos/${id}/`),
  create: (data) => api.post("productos/crear/", data),
  update: (id, data) => api.put(`productos/actualizar/${id}/`, data),
  delete: (id) => api.delete(`productos/eliminar/${id}/`),
  catalogo: () => api.get("catalogo/"),
  conDescuento: () => api.get("productos/con-descuento/"),
  sinGarantia: () => api.get("productos/sin-garantia/"),
  recomendaciones: () => api.get("recomendaciones/"),
};

// ========== CATEGORÍAS ==========
export const categoriasAPI = {
  list: () => api.get("categorias/"),
  create: (data) => api.post("categorias/crear/", data),
  delete: (id) => api.delete(`categoria/eliminar/${id}/`),
};

// ========== MARCAS ==========
export const marcasAPI = {
  list: () => api.get("marcas/"),
  create: (data) => api.post("marcas/crear/", data),
  delete: (id) => api.delete(`marcas/eliminar/${id}/`),
};

// ========== DESCUENTOS ==========
export const descuentosAPI = {
  list: () => api.get("descuentos/"),
  create: (data) => api.post("descuentos/crear/", data),
  update: (id, data) => api.put(`descuentos/${id}/`, data),
  delete: (id) => api.delete(`descuentos/eliminar/${id}/`),
  asignar: (id, data) => api.post(`descuentos/asignar-descuento/${id}/`, data),
};

// ========== GARANTÍAS ==========
export const garantiasAPI = {
  list: () => api.get("garantias/"),
  create: (data) => api.post("garantias/crear/", data),
  update: (id, data) => api.put(`garantias/${id}/`, data),
  delete: (id) => api.delete(`garantias/eliminar/${id}/`),
};

// ========== INVENTARIO ==========
export const inventarioAPI = {
  list: () => api.get("inventario/"),
  create: (data) => api.post("inventario/crear/", data),
  update: (id, data) => api.put(`inventario/actualizar/${id}/`, data),
};

// ========== CARRITO ==========
export const carritoAPI = {
  get: () => api.get("carrito/"),
  agregar: (data) => api.post("carrito/agregar/", data),
  eliminar: (productoId) => api.delete(`carrito/eliminar/${productoId}/`),
};

// ========== VENTAS Y PAGOS ==========
export const ventasAPI = {
  crearPago: (data) => api.post("pago/crear/", data),
  misNotas: () => api.get("notas/"),
  notaDetalle: (id) => api.get(`notas/${id}/`),
  notaPDF: (id) => api.get(`notas/${id}/pdf/`, { responseType: 'blob' }),
  historialCliente: (clienteId) => api.get(`historial/${clienteId}/`),
};

// ========== ROLES ==========
export const rolesAPI = {
  list: () => api.get("rol/"),
  create: (data) => api.post("rol/crear/", data),
  delete: (id) => api.delete(`rol/eliminar/${id}/`),
};

// ========== PERMISOS ==========
export const permisosAPI = {
  list: () => api.get("permisos/"),
  create: (data) => api.post("permisos/crear/", data),
  delete: (id) => api.delete(`permisos/eliminar/${id}/`),
  getByRole: (rolId) => api.get(`${rolId}/rol_id/rolP/`),
  updateRolePermissions: (data) => api.put("actP/", data),
  asignar: (data) => api.post("permisos/asignar/", data),
};

// ========== CLIENTES ==========
export const clientesAPI = {
  list: () => api.get("clientes/"),
  get: (id) => api.get(`cliente/${id}/info/`),
  update: (id, data) => api.put(`user/${id}/update/`, data),
  delete: (id) => api.delete(`${id}/elimUser/`),
};

// ========== TÉCNICOS ==========
export const tecnicosAPI = {
  list: () => api.get("tecnicos/"),
  get: (id) => api.get(`tecnicos/${id}/info/`),
  create: (data) => api.post("tecnicos/crear/", data),
  update: (id, data) => api.put(`tecnico/${id}/update/`, data),
  delete: (id) => api.delete(`tecnico/${id}/eliminar/`),
};

// ========== MANTENIMIENTOS ==========
export const mantenimientosAPI = {
  list: () => api.get("mantenimientos/"),
  create: (data) => api.post("mantenimientos/crear/", data),
  asignarTecnico: (id, data) => api.post(`mantenimientos/${id}/asignar-tecnico/`, data),
  porTecnico: () => api.get("mantenimientos/por-tecnico/"),
  actualizarEstado: (id, data) => api.put(`mantenimientos/${id}/actualizar-estado/`, data),
};

// ========== REPORTES ==========
export const reportesAPI = {
  dinamico: (params) => api.get("reportes/dinamico/", { params }),
};

// ========== BITÁCORA ==========
export const bitacoraAPI = {
  list: () => api.get("getBitacora/"),
};

// ========== NOTIFICACIONES ==========
export const notificacionesAPI = {
  list: (userId = null) => api.get("notificaciones/", { params: userId ? { user_id: userId } : {} }),
  create: (data) => api.post("notificaciones/crear/", data),
  delete: (id) => api.delete(`notificaciones/${id}/eliminar/`),
  updateFCMToken: (token) => api.post("fcm/update/", { fcm_token: token }),
};

// ========== PREDICCIONES (IA) ==========
export const prediccionesAPI = {
  predecir: (data) => api.post("ia/predecir/", data),
  entrenar: (data) => api.post("ia/entrenar/", data),
  dashboard: () => api.get("ia/dashboard/"),
};

export default api;
