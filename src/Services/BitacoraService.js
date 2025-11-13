import { api } from '../api/axiosConfig';

// ========== BITACORA ==========
export const listBitacora = () => api.get("getBitacora/");

export default {
  listBitacora,
};
