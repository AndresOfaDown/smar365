// src/features/admin/components/SidebarData.jsx
import { FaUser, FaBox, FaCloudUploadAlt } from "react-icons/fa";
/* Más adelante podrás añadir: import { FaClipboardList } from "react-icons/fa"; */

export const sections = [
  {
    key: "usuario",
    icon: <FaUser />,
    title: "Usuario",
    items: [
      { label: "Bitácora", to: "/admin/bitacora" },
      { label: "Lista de Usuarios", to: "/admin/listausuario" },
      { label: "Registrar Empleado", to: "/admin/registrar-empleado" },
    ],
  },
  {
    key: "inventario",
    icon: <FaBox />,
    title: "Inventario",
    items: [
      { label: "Registrar Producto", to: "/admin/registrar-producto" },
      { label: "Listar Producto", to: "/admin/listar-producto" },
      { label: "Registrar Categoría", to: "/admin/registrar-categoria" },
      { label: "Registrar Proveedores", to: "/admin/registrar-proveedores" },
      { label: "Listar Proveedores", to: "/admin/listarproveedores" },
      { label: "Listar Ordenes", to: "/admin/ordenesAdmin" },
    ],
  },


];



export const BRAND = "Shopealo";
