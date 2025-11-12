// src/presentation/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "../../layouts/MainLayout";
// Vistas del Admin
import { DashboardPage } from "../admin/DashboardPage";
import { UsuariosPage } from "../admin/UsuariosPage";
import { RolesPage } from "../admin/RolesPage";
import { PermisosPage } from "../admin/PermisosPage";
import { BitacoraPage } from "../admin/BitacoraPage";
import { ProductosPage } from "../admin/ProductosPage";
import { DetalleProductoPage } from "../admin/DetalleProductoPage";
import { CrearProductoForm } from "../admin/CrearProductoForm";
import { EditarProductoPage } from "../admin/EditarProductoPage";
import { CategoriasPage } from "../admin/CategoriasPage";
import { MarcasPage } from "../admin/MarcaPage";
import { DescuentosPage } from "../admin/DescuentosPage"
import { ProductosConDescuentoPage } from "../admin/ProductosConDescuentoPage"
//import { PedidosPage } from "../admin/PedidosPage";
import { NotificacionesPage } from "../admin/NotificacionesPage";
import { GarantiasPage } from '../admin/GarantiasPage'; 
import { ProductosSinGarantiaPage } from '../admin/ProductosSinGarantiaPage'; 
import { InventarioPage } from '../admin/InventarioPage';
import { ClientesPage } from '../admin/ClientesPage'; // (ajusta la ruta)
import { ClienteEditarPage } from '../admin/ClienteEditarPage';
import { ClienteDetallePage } from '../admin/ClienteDetallePage';  // (ajusta la ruta)
import { TecnicosPage } from '../admin/TecnicosPage'; // (ajusta la ruta)
import { TecnicoDetallePage } from '../admin/TecnicoDetallePage'; // (ajusta la ruta)
import { MantenimientosPage } from '../admin/MantenimientosPage'; // (ajusta la ruta)
import { ReportesPage } from '../admin/ReportesPage';


// Vistas del cliente
//import { LoginPage } from "../auth/LoginPage";
//import { RegisterPage } from "../auth/RegisterPage";

import { HomePage } from "../client/pages/HomePage";
import { ProductListPage } from "../client/pages/ProductListPage";
import { ProductDetailPage } from "../client/pages/ProductDetailPage";
import { CheckoutPage } from "../client/pages/CheckoutPage";
import { OrdersPage } from "../client/pages/OrdersPage";
import { ProfilePage } from "../client/pages/ProfilePage";
import { AdminLayout } from "../../layouts/AdminLayout";
import { HomeCliente } from "../client/pages/HomeCliente";
import { CartPage } from '../client/pages/CartPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas de Administrador*/}
        <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="permisos" element={<PermisosPage />} />
        <Route path="bitacora" element={<BitacoraPage />} />
        <Route path="crearproducto" element={<CrearProductoForm />} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="categorias" element={<CategoriasPage/>}/>
        <Route path="/admin/productos/detalles/:id" element={<DetalleProductoPage/>}/>
        <Route path="/admin/productos/editar/:id" element={<EditarProductoPage />} />
        <Route path="marca" element={<MarcasPage/>}/>
        <Route path="notificaciones" element={<NotificacionesPage />} />
        <Route path="descuentos" element={<DescuentosPage />} />
        <Route path="productoscondescuento" element={<ProductosConDescuentoPage />} />
        <Route path="/admin/garantias" element={<GarantiasPage />} />
        <Route path="/admin/productossingarantias" element={< ProductosSinGarantiaPage />} />
        <Route path="/admin/inventario" element={<InventarioPage />} />
        <Route path="/admin/clientes" element={<ClientesPage />} />
        <Route path="/admin/clientes/editar/:id" element={<ClienteEditarPage />} />
        <Route path="/admin/clientes/detalles/:id" element={<ClienteDetallePage />} />
        <Route path="/admin/tecnicos" element={<TecnicosPage />} />
        <Route path="/admin/tecnicos/detalles/:id" element={<TecnicoDetallePage />} />
        <Route path="/admin/mantenimientos" element={<MantenimientosPage />} />
        <Route path="/admin/reportes" element={<ReportesPage />} />
        

        {/*<Route path="Descuentos" element={<DescuentosPage/>} />*/}

      </Route>
        {/* 🌐 Rutas públicas (Cliente) */}
        <Route path="/" element={<MainLayout />}>
          <Route path="/cliente/home" element={<HomeCliente />}/> 
          <Route index element={<HomePage />} /> {/* Página principal */}
          <Route path="products" element={<ProductListPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="cart" element={<CartPage />} />
        </Route>

        {/* 🔑 Auth */}
        {/* 🔒 Layout protegido (Admin) — se agregará después */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* <Route index element={<DashboardPage />} /> */}
        </Route>

        {/* 🚫 Ruta por defecto si no existe */}
        <Route path="*" element={<h2 className='text-center mt-10 text-gray-600'>404 | Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
};
