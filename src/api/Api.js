import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/";

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

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh");
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}usuarios/api/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem("access", access);
          
          // Reintentar la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, limpiar tokens y redirigir al login
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ========== AUTENTICACIÓN ==========
export const authAPI = {
  login: (data) => api.post("usuarios/login/", data),
  register: (data) => api.post("usuarios/registro/", data),
  refreshToken: (refreshToken) => api.post("usuarios/api/token/refresh/", { refresh: refreshToken }),
};

// ========== USUARIOS ==========
export const usuariosAPI = {
  list: () => api.get("usuarios/getUser/"),
  login: (data) => api.post("usuarios/login/", data),
  create: (data) => api.post("usuarios/registro/", data),
  update: (id, data) => api.put(`usuarios/user/${id}/update/`, data),
  delete: (id) => api.delete(`usuarios/${id}/elimUser/`),
  getProfile: () => api.get("usuarios/perfil/me/"),
  updateProfile: (data) => api.put("usuarios/user/editar/", data),
  getInfo: () => api.get("usuarios/user/info/"),
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
  actualizar: (productoId, data) => api.put(`carrito/actualizar/${productoId}/`, data),  // ✅ UPDATE
  eliminar: (productoId) => api.delete(`carrito/eliminar/${productoId}/`),
  vaciar: () => api.delete("carrito/vaciar/"),  // ✅ DELETE ALL
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
  list: () => api.get("usuarios/rol/"),
  create: (data) => api.post("usuarios/rol/crear/", data),
  delete: (id) => api.delete(`usuarios/rol/eliminar/${id}/`),
};

// ========== PERMISOS ==========
export const permisosAPI = {
  list: () => api.get("usuarios/permisos/"),
  create: (data) => api.post("usuarios/permisos/crear/", data),
  delete: (id) => api.delete(`usuarios/permisos/eliminar/${id}/`),
  getByRole: (rolId) => api.get(`usuarios/${rolId}/rol_id/rolP/`),
  updateRolePermissions: (data) => api.put("usuarios/actP/", data),
  asignar: (data) => api.post("usuarios/permisos/asignar/", data),
};

// ========== CLIENTES ==========
export const clientesAPI = {
  list: () => api.get("usuarios/clientes/"),
  get: (id) => api.get(`usuarios/cliente/${id}/info/`),
  update: (id, data) => api.put(`usuarios/user/${id}/update/`, data),
  delete: (id) => api.delete(`usuarios/${id}/elimUser/`),
};

// ========== TÉCNICOS ==========
export const tecnicosAPI = {
  list: () => api.get("usuarios/tecnicos/"),
  get: (id) => api.get(`usuarios/tecnicos/${id}/info/`),
  create: (data) => api.post("usuarios/tecnicos/crear/", data),
  update: (id, data) => api.put(`usuarios/tecnico/${id}/update/`, data),
  delete: (id) => api.delete(`usuarios/tecnico/${id}/eliminar/`),
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
  list: () => api.get("usuarios/getBitacora/"),
};

// ========== NOTIFICACIONES ==========
export const notificacionesAPI = {
  list: (userId = null) => api.get("usuarios/notificaciones/", { params: userId ? { user_id: userId } : {} }),
  create: (data) => api.post("usuarios/notificaciones/crear/", data),
  delete: (id) => api.delete(`usuarios/notificaciones/${id}/eliminar/`),
  updateFCMToken: (token) => api.post("usuarios/fcm/update/", { fcm_token: token }),
};

// ========== PREDICCIONES (IA) ==========
export const prediccionesAPI = {
  predecir: (data) => api.post("ia/predecir/", data),
  entrenar: (data) => api.post("ia/entrenar/", data),
  dashboard: () => api.get("ia/dashboard/"),
};

export default api;
