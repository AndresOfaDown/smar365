import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getSubtotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-10 text-center min-h-screen flex items-center justify-center">
        <div>
          <FaShoppingCart className="text-8xl text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-6">
            Parece que aún no has agregado productos. ¡Explora nuestro catálogo!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            <FaArrowLeft />
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const envio = 0;
  const total = subtotal + envio;

  const handleRemove = (id) => {
    removeFromCart(id);
    toast.success("Producto eliminado del carrito ✅");
  };

  const handleUpdateQuantity = (id, cantidad) => {
    updateQuantity(id, cantidad);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Tu Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda: Lista de Productos */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 flex gap-4 hover:shadow-lg transition"
              >
                {/* Imagen */}
                <div className="w-24 h-24 flex-shrink-0">
                  {item.imagen ? (
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <FaShoppingCart className="text-gray-400 text-2xl" />
                    </div>
                  )}
                </div>

                {/* Detalles */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {item.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.descripcion}
                  </p>
                  <p className="font-bold text-green-600 text-lg">
                    ${parseFloat(item.precio).toFixed(2)}
                  </p>
                </div>

                {/* Cantidad */}
                <div className="flex flex-col items-center justify-center gap-2 px-4 border-r border-gray-200">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, (item.cantidad || 1) - 1)
                    }
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold transition"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold text-gray-900 min-w-8 text-center">
                    {item.cantidad || 1}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, (item.cantidad || 1) + 1)
                    }
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold transition"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal y Eliminar */}
                <div className="flex flex-col items-end justify-between pl-4">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Eliminar producto"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                  <p className="font-bold text-gray-900 text-lg">
                    ${(parseFloat(item.precio) * (item.cantidad || 1)).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Columna Derecha: Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Resumen del Pedido</h3>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-500 font-semibold">GRATIS</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-900">Total a Pagar</span>
                  <span className="text-3xl font-bold text-green-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/checkout'}
                className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg font-semibold transition transform hover:scale-105 mb-3"
              >
                Proceder al Pago
              </button>

              <button
                onClick={() => {
                  if (window.confirm("¿Deseas vaciar el carrito?")) {
                    clearCart();
                    toast.success("Carrito vaciado ✅");
                  }
                }}
                className="w-full py-2 px-6 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-semibold transition"
              >
                Vaciar Carrito
              </button>

              <Link
                to="/"
                className="block text-center mt-4 text-blue-600 hover:text-blue-800 font-semibold transition"
              >
                &larr; Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};