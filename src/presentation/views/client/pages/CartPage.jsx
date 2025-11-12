import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
//import { useCart } from "../context/CartContext"; // Ajusta la ruta

export const CartPage = () => {
  const { cartItems: contextCartItems, fetchCartCount, removeFromCart: contextRemoveFromCart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  // Función para obtener el carrito desde la API Django
  const fetchCartFromAPI = async () => {
    try {
      setLoadingCart(true);
      
      // Obtén el token del usuario autenticado
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Debes iniciar sesión para ver tu carrito");
        setLoadingCart(false);
        return;
      }

      // Realiza el fetch a tu endpoint de Django
      const response = await fetch("http://localhost:8000/api/carrito/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}` // Django REST Framework usa 'Token'
        }
      });

      if (!response.ok) {
        throw new Error("Error al obtener el carrito");
      }

      const data = await response.json();
      console.log("Carrito desde API:", data); // Para debug
      
      // Ajusta según la estructura de respuesta de tu API Django
      setCartItems(data.items || data.carrito || data || []);
      
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Error al cargar el carrito");
    } finally {
      setLoadingCart(false);
    }
  };

  // Cargar el carrito al montar el componente
  useEffect(() => {
    fetchCartFromAPI();
  }, []);

  // Función para eliminar un producto del carrito
  const removeFromCart = async (productoId) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:8000/api/carrito/eliminar/${productoId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      // Actualiza el estado local
      const updatedCart = cartItems.filter(item => item.producto_id !== productoId && item.id !== productoId);
      setCartItems(updatedCart);
      toast.success("Producto eliminado del carrito");
      
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Error al eliminar el producto");
    }
  };

  // Función para actualizar cantidad (si tienes endpoint para esto)
  const updateQuantity = async (productoId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem("token");
      
      // Si no tienes endpoint para actualizar cantidad, puedes comentar esto
      // y solo actualizar el estado local por ahora
      
      // Actualiza el estado local
      const updatedCart = cartItems.map(item => 
        (item.producto_id === productoId || item.id === productoId) 
          ? { ...item, cantidad: newQuantity } 
          : item
      );
      setCartItems(updatedCart);
      toast.success("Cantidad actualizada");
      
      // TODO: Implementar endpoint en Django para actualizar cantidad
      // const response = await fetch(`http://localhost:8000/api/carrito/actualizar/${productoId}/`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Token ${token}`
      //   },
      //   body: JSON.stringify({ cantidad: newQuantity })
      // });
      
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Error al actualizar la cantidad");
    }
  };

  // Función para calcular el subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + (parseFloat(item.precio) * (item.cantidad || 1)),
    0
  );

  // Muestra "Cargando..." mientras el carrito se carga
  if (loadingCart) {
    return (
      <div className="container mx-auto p-10 text-center">
        <div className="animate-pulse">
          <FaShoppingCart className="text-8xl text-gray-300 mx-auto mb-6" />
          <p className="text-gray-500 text-lg">Cargando tu carrito...</p>
        </div>
      </div>
    );
  }

  // Muestra "Vacío" si no hay ítems en el carrito
  if (!loadingCart && cartItems.length === 0) {
    return (
      <div className="container mx-auto p-10 text-center">
        <FaShoppingCart className="text-8xl text-gray-300 mx-auto mb-6" />
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-6">
          Parece que aún no has agregado productos. ¡Explora nuestro catálogo!
        </p>
        <Link
          to="/cliente/home"
          className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 max-w-xs mx-auto justify-center"
        >
          <FaArrowLeft />
          Volver a la tienda
        </Link>
      </div>
    );
  }

  // Renderiza el carrito cuando hay productos
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Tu Carrito de Compras lech</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Lista de Productos */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase">Quitar</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cartItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img 
                          className="h-12 w-12 rounded-md object-cover" 
                          src={item.imagen || "https://placehold.co/100x100?text=N/A"} 
                          alt={item.producto_nombre} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.producto_nombre || item.nombre || "Nombre no disponible"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">${parseFloat(item.precio).toFixed(2)}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, (item.cantidad || 1) - 1)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                      >
                        -
                      </button>
                      <span className="text-sm text-gray-700 px-2">{item.cantidad || 1}</span>
                      <button
                        onClick={() => updateQuantity(item.id, (item.cantidad || 1) + 1)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ${(parseFloat(item.precio) * (item.cantidad || 1)).toFixed(2)}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Quitar producto"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Columna Derecha: Resumen del Pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Resumen del Pedido</h3>
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Envío</span>
              <span className="text-green-500">GRATIS</span>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total a Pagar</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/cliente/checkout'}
              className="mt-6 w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg font-semibold"
            >
              Proceder al Pago
            </button>
            <Link
              to="/cliente/home"
              className="block text-center mt-4 text-blue-600 hover:text-blue-800"
            >
              &larr; Seguir comprando
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};