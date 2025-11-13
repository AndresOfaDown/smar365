import { useState, useEffect, useCallback } from "react";

/**
 * Hook personalizado para manejar la autenticación del usuario
 * Proporciona: isAuthenticated, user, login, logout, refreshUser
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al montar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("access");
    const usuarioData = localStorage.getItem("usuario");

    if (token && usuarioData) {
      setIsAuthenticated(true);
      try {
        setUser(JSON.parse(usuarioData));
      } catch {
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("usuario");
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const refreshUser = useCallback((newUserData) => {
    localStorage.setItem("usuario", JSON.stringify(newUserData));
    setUser(newUserData);
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    logout,
    refreshUser,
    checkAuth,
  };
};
