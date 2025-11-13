import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar producto al carrito
  const addToCart = (producto) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === producto.id);

      if (existingItem) {
        // Si ya existe, incrementar cantidad
        return prevItems.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        );
      } else {
        // Si no existe, agregarlo nuevo
        return [...prevItems, { ...producto, cantidad: 1 }];
      }
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (productoId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productoId)
    );
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productoId, cantidad) => {
    if (cantidad < 1) {
      removeFromCart(productoId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productoId ? { ...item, cantidad } : item
      )
    );
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Obtener total de items
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + (item.cantidad || 1), 0);
  };

  // Obtener subtotal
  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total + parseFloat(item.precio || 0) * (item.cantidad || 1),
      0
    );
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getSubtotal,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de CartProvider");
  }
  return context;
};