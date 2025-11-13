import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { api } from "../../../data/sources/api";

export const ProductosSinGarantiaPage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductosSinGarantia = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          "productos/sin-garantia/"
        );
        setProductos(res.data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        toast.error("No se pudieron cargar los productos ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchProductosSinGarantia();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Productos Sin Garantía
      </h2>

      {loading ? (
        <p className="text-gray-500">Cargando productos...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-yellow-500 text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Nombre del Producto</th>
                <th className="py-3 px-4 text-left">Precio</th>
                <th className="py-3 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productos.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{producto.id}</td>
                  <td className="py-3 px-4 font-medium">{producto.nombre}</td>
                  <td className="py-3 px-4 text-gray-600">${parseFloat(producto.precio).toFixed(2)}</td>
                  <td className="py-3 px-4 text-center">
                    <Link
                      to={`/admin/productos/editar/${producto.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Asignar Garantía
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};