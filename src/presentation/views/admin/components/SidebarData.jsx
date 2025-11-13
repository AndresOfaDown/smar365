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
      { label: "Gestionar Productos", to: "/admin/productos" },
    ],
  },


];



export const BRAND = "Shopealo";
