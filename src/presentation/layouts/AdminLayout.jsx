import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FaUsers, FaBox, FaShoppingCart, FaBell, FaHome, FaSignOutAlt, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

export const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const token = localStorage.getItem("access");

    if (!token || !usuario) {
      navigate("/");
      return;
    }

    const rol = (usuario.rol || "").toUpperCase();
    if (!["ADMIN", "ADMINISTRADOR", "SUPERUSER"].includes(rol)) {
      navigate("/");
    }
  }, [navigate]);

  // ✅ Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("usuario");

    toast.info("Sesión cerrada correctamente 👋");
    navigate("/"); // redirige al inicio
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* 🔹 Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-500">
          SmartSales<span className="text-yellow-300">Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-3">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <FaHome className="inline mr-2" /> Dashboard
          </NavLink>
          <NavLink
            to="/admin/usuarios"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <FaUsers className="inline mr-2" /> Usuarios
          </NavLink>
          <NavLink
          to="/admin/roles"
           className={({ isActive }) =>
            `block px-3 py-2 rounded-md hover:bg-blue-600 ${
           isActive ? "bg-blue-600" :""
            }`
          }
          >
            <FaUsers className="inline mr-2" /> Roles
          </NavLink>
          <NavLink
          to="/admin/permisos"
           className={({ isActive }) =>
            `block px-3 py-2 rounded-md hover:bg-blue-600 ${
           isActive ? "bg-blue-600" :""
            }`
          }
          >
            <FaUsers className="inline mr-2" /> Permisos
          </NavLink>
          <NavLink
          to="/admin/clientes"
           className={({ isActive }) =>
            `block px-3 py-2 rounded-md hover:bg-blue-600 ${
           isActive ? "bg-blue-600" :""
            }`
          }
          >
            <FaUsers className="inline mr-2" /> Clientes
          </NavLink>
          <NavLink
            to="/admin/categorias"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <FaBox className="inline mr-2" /> Categorias
          </NavLink>
          <NavLink
            to="/admin/crearproducto"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <FaBox className="inline mr-2" /> Crear Productos
          </NavLink>

          <NavLink
            to="/admin/productos"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <FaBox className="inline mr-2" /> Productos
          </NavLink>

          <NavLink
            to="/admin/inventario"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <FaBox className="inline mr-2" /> Inventario
          </NavLink>

          <NavLink
            to="/admin/productoscondescuento"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <FaBox className="inline mr-2" /> Productos Con Descuento
          </NavLink>

          <NavLink
            to="/admin/descuentos"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <FaBox className="inline mr-2" /> Descuentos
          </NavLink>

          <NavLink
            to="/admin/garantias"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <FaBox className="inline mr-2" /> Garantias
          </NavLink>

          <NavLink
            to="/admin/productossingarantias"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <FaBox className="inline mr-2" /> Productos sin garantias
          </NavLink>

          <NavLink
            to="/admin/marca"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <FaBell className="inline mr-2" /> Marca
          </NavLink>
          <NavLink
            to="/admin/notificaciones"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <FaBell className="inline mr-2" /> Notificaciones
          </NavLink>

            <NavLink
            to="/admin/tecnicos"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <FaBell className="inline mr-2" /> Tecnicos
          </NavLink>

          <NavLink
            to="/admin/mantenimientos"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <FaBell className="inline mr-2" /> Mantenimientos
          </NavLink>

            <NavLink
            to="/admin/reportes"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <FaBell className="inline mr-2" /> Reportes
          </NavLink>

          <NavLink
            to="/admin/predicciones"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <FaBell className="inline mr-2" /> Predicciones
          </NavLink>

        </nav>
        <NavLink
          to="/admin/bitacora"
          className={({ isActive }) =>
           `block px-3 py-2 rounded-md hover:bg-blue-600 ${
             isActive ? "bg-blue-600" : ""
          }`
        }
       >
       <FaBell className="inline mr-2" /> Bitácora
      </NavLink>


        {/* 🔹 Botón de cerrar sesión */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 text-white font-semibold"
        >
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </aside>

      {/* 🔹 Contenido principal */}
      <main className="flex-1 p-4 pt-2">
        <Outlet />
      </main>
    </div>
  );
};
