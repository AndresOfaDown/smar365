import { api } from "../api/axiosConfig";

// ========== USUARIOS ==========
export const listUsers = () => api.get("getUser/");

export const getUser = async (id) => {
  const response = await listUsers();
  const user = response.data.find(u => u.id === id);
  return { data: user };
};

export const createUser = (data) => api.post("registro/", data);

export const updateUser = (id, data) => api.put(`user/${id}/update/`, data);

export const deleteUser = (id) => api.delete(`${id}/elimUser/`);

export const getProfile = () => api.get("perfil/me/");

export const updateProfile = (data) => api.put("user/editar/", data);

export const getInfo = () => api.get("user/info/");

export default {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  getInfo,
};