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

// ========== PRODUCTOS ==========
export const productosAPI = {
  // Listar todos los productos
  list: () => api.get("productos/"),
  
  // Obtener un producto por ID
  get: (id) => api.get(`productos/${id}/`),
  
  // Crear un nuevo producto
  create: (data) => api.post("productos/crear/", data),
  
  // Actualizar un producto
  update: (id, data) => api.put(`productos/${id}/`, data),
  
  // Eliminar un producto
  delete: (id) => api.delete(`productos/eliminar/${id}/`),
};

// ========== CATEGORÍAS ==========
export const categoriasAPI = {
  // Listar todas las categorías
  list: () => api.get("categorias/"),
  
  // Crear una nueva categoría
  create: (data) => api.post("categorias/crear/", data),
  
  // Eliminar una categoría
  delete: (id) => api.delete(`categoria/eliminar/${id}/`),
};

// ========== MARCAS ==========
export const marcasAPI = {
  // Listar todas las marcas
  list: () => api.get("marcas/"),
  
  // Crear una nueva marca
  create: (data) => api.post("marcas/crear/", data),
  
  // Eliminar una marca
  delete: (id) => api.delete(`marcas/eliminar/${id}/`),
};

// ========== DESCUENTOS ==========
export const descuentosAPI = {
  // Listar todos los descuentos
  list: () => api.get("descuentos/"),
  
  // Crear un nuevo descuento
  create: (data) => api.post("descuentos/crear/", data),
  
  // Actualizar un descuento
  update: (id, data) => api.put(`descuentos/${id}/`, data),
  
  // Eliminar un descuento
  delete: (id) => api.delete(`descuentos/eliminar/${id}/`),
};

// ========== GARANTÍAS ==========
export const garantiasAPI = {
  // Listar todas las garantías
  list: () => api.get("garantias/"),
  
  // Crear una nueva garantía
  create: (data) => api.post("garantias/crear/", data),
  
  // Actualizar una garantía
  update: (id, data) => api.put(`garantias/${id}/`, data),
  
  // Eliminar una garantía
  delete: (id) => api.delete(`garantias/eliminar/${id}/`),
};

// ========== USUARIOS ==========
export const usuariosAPI = {
  // Listar todos los usuarios
  list: () => api.get("getUser/"),
  
  // Login - obtener tokens
  login: (data) => api.post("login/", data),
  
  // Registro - crear nuevo usuario
  create: (data) => api.post("registro/", data),
  
  // Actualizar un usuario
  update: (id, data) => api.put(`user/${id}/update/`, data),
  
  // Eliminar un usuario
  delete: (id) => api.delete(`${id}/elimUser/`),
  
  // Obtener info del usuario autenticado
  getProfile: () => api.get("perfil/me/"),
  
  // Actualizar perfil del usuario autenticado
  updateProfile: (data) => api.put("user/editar/", data),
};

// ========== ROLES ==========
export const rolesAPI = {
  // Listar todos los roles
  list: () => api.get("rol/"),
  
  // Crear un nuevo rol
  create: (data) => api.post("rol/crear/", data),
  
  // Eliminar un rol
  delete: (id) => api.delete(`rol/eliminar/${id}/`),
};

// ========== PERMISOS ==========
export const permisosAPI = {
  // Listar todos los permisos
  list: () => api.get("permisos/"),
  
  // Crear un nuevo permiso
  create: (data) => api.post("permisos/crear/", data),
  
  // Eliminar un permiso
  delete: (id) => api.delete(`permisos/eliminar/${id}/`),
  
  // Obtener permisos de un rol específico
  getByRole: (rolId) => api.get(`${rolId}/rol_id/rolP/`),
  
  // Actualizar permisos de un rol
  updateRolePermissions: (data) => api.put("actP/", data),
};

// ========== CLIENTES ==========
export const clientesAPI = {
  // Listar todos los clientes
  list: () => api.get("clientes/"),
  
  // Obtener un cliente por ID
  get: (id) => api.get(`cliente/${id}/info/`),
  
  // Actualizar un cliente
  update: (id, data) => api.put(`user/${id}/update/`, data),
  
  // Eliminar un cliente
  delete: (id) => api.delete(`${id}/elimUser/`),
};

// ========== TÉCNICOS ==========
export const tecnicosAPI = {
  // Listar todos los técnicos
  list: () => api.get("tecnicos/"),
  
  // Obtener un técnico por ID
  get: (id) => api.get(`tecnico/${id}/`),
  
  // Crear un nuevo técnico
  create: (data) => api.post("tecnicos/crear/", data),
  
  // Actualizar un técnico
  update: (id, data) => api.put(`tecnico/${id}/update/`, data),
  
  // Eliminar un técnico
  delete: (id) => api.delete(`tecnico/${id}/eliminar/`),
};

// ========== INVENTARIO ==========
export const inventarioAPI = {
  // Listar inventario
  list: () => api.get("inventario/"),
};

// ========== MANTENIMIENTOS ==========
export const mantenimientosAPI = {
  // Listar mantenimientos
  list: () => api.get("mantenimientos/"),
};

// ========== REPORTES ==========
export const reportesAPI = {
  // Listar reportes
  list: () => api.get("reportes/"),
};

// ========== PREDICCIONES ==========
export const prediccionesAPI = {
  // Obtener predicciones
  list: () => api.get("predicciones/"),
};

export default api;
