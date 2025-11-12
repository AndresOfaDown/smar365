import { Link, NavLink } from "react-router-dom";
//import { useCart } from "../client/context/CartContext";
import { FaUser, FaShoppingCart, FaSearch, FaBolt } from "react-icons/fa";

export const Navbar = () => {
  //const { cartCount } = useCart();
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        {/* 🔷 Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold text-blue-600"
        >
          <FaBolt className="text-yellow-400" />
          SmartSales<span className="text-gray-800">365</span>
        </Link>

        {/* 🔹 Menú principal */}
        <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
            }
          >
            Inicio
          </NavLink>
          <NavLink to="/products" className="hover:text-blue-600">
            Productos
          </NavLink>
          <NavLink to="/orders" className="hover:text-blue-600">
            Mis Pedidos
          </NavLink>
          <NavLink to="/profile" className="hover:text-blue-600">
            Perfil
          </NavLink>
        </nav>

        {/* 🔸 Iconos */}
        <div className="flex items-center gap-5 text-gray-700">
          <button className="hover:text-blue-600">
            <FaSearch className="w-5 h-5" />
          </button>
          <Link to="/cart" className="relative hover:text-blue-600">
            <FaShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs rounded-full px-1.5">
              2
            </span>
          </Link>
          <Link to="/profile" className="hover:text-blue-600">
            <FaUser className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};
