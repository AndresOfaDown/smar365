import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";  // Importar Link para la navegación
import { CrearProductoForm } from "./CrearProductoForm";


  export const ProductosPage = () => {  
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  // 🔹 Cargar productos existentes
  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/productos/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductos(res.data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      toast.error("No se pudieron cargar los productos ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // 🔹 Eliminar producto
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/productos/eliminar/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Producto eliminado correctamente ✅");
      setProductos(productos.filter((producto) => producto.id !== id)); // Eliminar de la lista
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      toast.error("Error al eliminar el producto ❌");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Gestión de Productos</h2>
      </div>

      {/* Tabla de productos */}
      {loading ? (
        <p className="text-gray-500">Cargando productos...</p>
      ) : (
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Nombre del Producto</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{producto.id}</td>
                <td className="py-2 px-4 font-medium">{producto.nombre}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleDelete(producto.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                  <Link
                    to={`/admin/productos/detalles/${producto.id}`}  // Redirigir a la página de detalles
                    className="text-green-500 hover:text-green ml-2"
                  >
                    Detalles
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
