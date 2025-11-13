import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import * as ProductoService from "../../../Services/ProductoService";

export const ProductosConDescuentoPage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductosConDescuento = async () => {
      setLoading(true);
      try {
        const productosRes = await ProductoService.conDescuento();
        setProductos(productosRes.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        toast.error("No se pudieron cargar los datos ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchProductosConDescuento();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Productos con Descuento (Activos Hoy)
      </h2>

      {loading ? (
        <p className="text-gray-500">Cargando productos...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Producto</th>
                <th className="py-3 px-4 text-left">Precio Original</th>
                <th className="py-3 px-4 text-left">Descuento Aplicado</th>
                <th className="py-3 px-4 text-left">Precio Final</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productos.map((producto) => {
                
                // --- CAMBIO: Cálculo simplificado ---
                // Asumo que tu ProductoSerializer anida el descuento:
                const precioOriginal = parseFloat(producto.precio);
                
                // Verificamos que el descuento anidado exista
                if (!producto.descuento) {
                  return null; // Este producto no debería estar aquí, pero es un buen control
                }
                
                const porcentaje = parseFloat(producto.descuento.porcentaje);
                const precioFinal = precioOriginal * (1 - porcentaje / 100);
                const nombreDescuento = `${producto.descuento.nombre} (${porcentaje}%)`;

                return (
                  <tr key={producto.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{producto.nombre}</td>
                    <td className="py-3 px-4 text-gray-600">${precioOriginal.toFixed(2)}</td>
                    <td className="py-3 px-4 text-green-600 font-medium">{nombreDescuento}</td>
                    <td className="py-3 px-4 text-blue-600 font-bold">${precioFinal.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        to={`/admin/productos/editar/${producto.id}`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Ver / Editar
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};