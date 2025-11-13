import { api } from '../api/axiosConfig';

// ========== AUTENTICACION ==========
export const login = (data) => api.post("login/", data);
export const register = (data) => api.post("registro/", data);
export const refreshToken = (refreshToken) => 
  api.post("api/token/refresh/", { refresh: refreshToken });

export default {
  login,
  register,
  refreshToken,
};
