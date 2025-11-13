import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../../../../hooks/useAuth";
import { FaUser, FaShoppingCart, FaSearch, FaBolt, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

export const Navbar = () => {
  const cart = useCart();
  const cartCount = cart?.getCartCount?.() || 0;
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      logout();
      setMobileMenuOpen(false);
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* 🔷 Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-extrabold text-blue-600 whitespace-nowrap"
          >
            <FaBolt className="text-yellow-400" />
            <span className="hidden sm:inline">SmartSales<span className="text-gray-800">365</span></span>
            <span className="sm:hidden">SS365</span>
          </Link>

          {/* 🔹 Menú principal (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-gray-700 font-medium mx-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
              }
            >
              Inicio
            </NavLink>
            <NavLink to="/cliente/productos" className="hover:text-blue-600">
              Productos
            </NavLink>
            <NavLink to="/cliente/ordenes" className="hover:text-blue-600">
              Mis Pedidos
            </NavLink>
            <NavLink to="/cliente/perfil" className="hover:text-blue-600">
              Perfil
            </NavLink>
          </nav>

          {/* 🔐 Auth Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition font-medium text-sm"
                >
                  <FaSignInAlt /> Inicia Sesión
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-medium text-sm"
                >
                  <FaUserPlus /> Regístrate
                </Link>
              </>
            ) : (
              <>
                <span className="text-gray-700 font-medium text-sm mr-2">
                  Hola, {user?.nombre || "Usuario"}!
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition font-medium text-sm"
                >
                  <FaSignOutAlt /> Salir
                </button>
              </>
            )}
          </div>

          {/* 🔸 Iconos móviles y carrito */}
          <div className="flex items-center gap-4 text-gray-700 flex-shrink-0">
            <button className="hover:text-blue-600">
              <FaSearch className="w-5 h-5" />
            </button>
            <Link to="/cliente/carrito" className="relative hover:text-blue-600">
              <FaShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            {/* Menú hamburguesa móvil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden hover:text-blue-600 text-xl"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Menú móvil expandible */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 flex flex-col gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </NavLink>
            <NavLink to="/cliente/productos" className="text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
              Productos
            </NavLink>
            <NavLink to="/cliente/ordenes" className="text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
              Mis Pedidos
            </NavLink>
            <NavLink to="/cliente/perfil" className="text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
              Perfil
            </NavLink>
            
            <div className="border-t border-gray-200 pt-4 mt-2 flex flex-col gap-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="text-center px-4 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Inicia Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Regístrate
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-gray-700 font-medium px-4">Hola, {user?.nombre || "Usuario"}!</span>
                  <button
                    onClick={handleLogout}
                    className="text-center px-4 py-2 text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition font-medium"
                  >
                    Cerrar Sesión
                  </button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
