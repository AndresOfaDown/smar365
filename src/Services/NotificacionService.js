import { api } from '../api/axiosConfig';

// ========== NOTIFICACIONES ==========
export const listNotificaciones = (userId = null) => 
  api.get("notificaciones/", { params: userId ? { user_id: userId } : {} });
export const createNotificacion = (data) => api.post("notificaciones/crear/", data);
export const deleteNotificacion = (id) => api.delete(`notificaciones/${id}/eliminar/`);
export const updateFCMToken = (token) => api.post("fcm/update/", { fcm_token: token });

export default {
  listNotificaciones,
  createNotificacion,
  deleteNotificacion,
  updateFCMToken,
};
