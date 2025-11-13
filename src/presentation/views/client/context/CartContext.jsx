import { createContext, useContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { carritoAPI } from '../../../../api/api';
import { useAuth } from '../../../../hooks/useAuth';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Cargar carrito desde backend o localStorage al montar
  useEffect(() => {
    const cargarCarrito = async () => {
      if (isAuthenticated) {
        // Verificar si el usuario es Cliente antes de cargar carrito
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const rolId = user.rol_id || user.rol;
        
        // Solo cargar carrito si es Cliente (rol_id === 2)
        if (rolId !== 2) {
          console.log('Usuario no es cliente, no se carga carrito');
          setCartItems([]);
          return;
        }

        // Usuario autenticado y es Cliente: cargar desde backend
        setLoading(true);
        try {
          const response = await carritoAPI.get();
          const data = response.data;
          
          // El backend devuelve { detalles: [...] }
          // Necesitamos transformar los detalles en items con cantidad
          if (data && data.detalles && Array.isArray(data.detalles)) {
            // Contar productos repetidos y agruparlos
            const itemsMap = new Map();
            data.detalles.forEach(detalle => {
              const productoId = detalle.producto.id;
              if (itemsMap.has(productoId)) {
                const item = itemsMap.get(productoId);
                item.cantidad += 1;
              } else {
                itemsMap.set(productoId, {
                  id: detalle.producto.id,
                  nombre: detalle.producto.nombre,
                  precio: detalle.producto.precio,
                  descripcion: detalle.producto.descripcion,
                  cantidad: 1,
                  detalle_id: detalle.id // Guardar el ID del detalle para eliminar
                });
              }
            });
            setCartItems(Array.from(itemsMap.values()));
          } else {
            setCartItems([]);
          }
        } catch (error) {
          console.error("Error al cargar el carrito desde backend:", error);
          // Fallback a localStorage si falla el backend
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            try {
              const parsed = JSON.parse(savedCart);
              setCartItems(Array.isArray(parsed) ? parsed : []);
            } catch (err) {
              console.error("Error al parsear localStorage:", err);
              setCartItems([]);
            }
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Usuario no autenticado: cargar desde localStorage
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          try {
            const parsed = JSON.parse(savedCart);
            setCartItems(Array.isArray(parsed) ? parsed : []);
          } catch (error) {
            console.error("Error al cargar el carrito desde localStorage:", error);
            setCartItems([]);
          }
        }
      }
    };
    
    cargarCarrito();
  }, [isAuthenticated]);

  // Guardar carrito en localStorage cada vez que cambia (backup local)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar producto al carrito
  const addToCart = async (producto, cantidad = 1) => {
    if (isAuthenticated) {
      // Usuario autenticado: agregar al backend
      setLoading(true);
      try {
        await carritoAPI.agregar({ 
          producto_id: producto.id, 
          cantidad: cantidad
        });
        // Recargar carrito desde backend
        const response = await carritoAPI.get();
        const data = response.data;
        
        if (data && data.detalles && Array.isArray(data.detalles)) {
          const itemsMap = new Map();
          data.detalles.forEach(detalle => {
            const productoId = detalle.producto.id;
            if (itemsMap.has(productoId)) {
              const item = itemsMap.get(productoId);
              item.cantidad += 1;
            } else {
              itemsMap.set(productoId, {
                id: detalle.producto.id,
                nombre: detalle.producto.nombre,
                precio: detalle.producto.precio,
                descripcion: detalle.producto.descripcion,
                cantidad: 1,
                detalle_id: detalle.id
              });
            }
          });
          setCartItems(Array.from(itemsMap.values()));
        } else {
          setCartItems([]);
        }
        toast.success(`✅ ${cantidad} ${producto.nombre}(s) agregado(s) al carrito`);
        return true;
      } catch (error) {
        console.error("Error al agregar al carrito:", error);
        
        // Mostrar mensaje de error específico del backend
        if (error.response?.data?.error) {
          toast.error(`❌ ${error.response.data.error}`);
        } else if (error.response?.status === 400) {
          toast.error("❌ Solo los clientes pueden agregar productos al carrito. Cierra sesión y entra como cliente.");
        } else {
          toast.error("❌ Error al agregar al carrito");
        }
        return false;
      } finally {
        setLoading(false);
      }
    } else {
      // Usuario no autenticado: agregar a localStorage
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === producto.id);
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: (item.cantidad || 1) + cantidad }
              : item
          );
        } else {
          return [...prevItems, { ...producto, cantidad: cantidad }];
        }
      });
      toast.success(`✅ ${cantidad} ${producto.nombre}(s) agregado(s)`);
      return true;
    }
  };

  // Eliminar producto del carrito
  const removeFromCart = async (productoId) => {
    if (isAuthenticated) {
      // Usuario autenticado: eliminar del backend
      setLoading(true);
      try {
        await carritoAPI.eliminar(productoId);
        // Recargar carrito desde backend
        const response = await carritoAPI.get();
        const data = response.data;
        
        // Transformar detalles del backend en items con cantidad
        if (data && data.detalles && Array.isArray(data.detalles)) {
          const itemsMap = new Map();
          data.detalles.forEach(detalle => {
            const pId = detalle.producto.id;
            if (itemsMap.has(pId)) {
              const item = itemsMap.get(pId);
              item.cantidad += 1;
            } else {
              itemsMap.set(pId, {
                id: detalle.producto.id,
                nombre: detalle.producto.nombre,
                precio: detalle.producto.precio,
                descripcion: detalle.producto.descripcion,
                cantidad: 1,
                detalle_id: detalle.id
              });
            }
          });
          setCartItems(Array.from(itemsMap.values()));
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error al eliminar del carrito (backend):", error);
        toast.error('No se pudo eliminar del carrito ❌');
        // Fallback: eliminar localmente
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== productoId)
        );
      } finally {
        setLoading(false);
      }
    } else {
      // Usuario no autenticado: eliminar de localStorage
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== productoId)
      );
    }
  };

  // Actualizar cantidad de un producto
  const updateQuantity = async (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      removeFromCart(productoId);
      return;
    }

    if (isAuthenticated) {
      // ✅ Ahora usamos el endpoint actualizar del backend
      setLoading(true);
      try {
        await carritoAPI.actualizar(productoId, { cantidad: nuevaCantidad });
        
        // Recargar carrito desde backend
        const response = await carritoAPI.get();
        const data = response.data;
        
        if (data && data.detalles && Array.isArray(data.detalles)) {
          const itemsMap = new Map();
          data.detalles.forEach(detalle => {
            const pId = detalle.producto.id;
            if (itemsMap.has(pId)) {
              const item = itemsMap.get(pId);
              item.cantidad += 1;
            } else {
              itemsMap.set(pId, {
                id: detalle.producto.id,
                nombre: detalle.producto.nombre,
                precio: detalle.producto.precio,
                descripcion: detalle.producto.descripcion,
                cantidad: 1,
                detalle_id: detalle.id
              });
            }
          });
          setCartItems(Array.from(itemsMap.values()));
        } else {
          setCartItems([]);
        }
        toast.success('✅ Cantidad actualizada');
      } catch (error) {
        console.error("Error al actualizar cantidad:", error);
        toast.error('❌ No se pudo actualizar la cantidad');
      } finally {
        setLoading(false);
      }
    } else {
      // Usuario no autenticado: actualizar en localStorage
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
        )
      );
    }
  };

  // Limpiar carrito
  const clearCart = async () => {
    if (isAuthenticated) {
      // ✅ Usar el nuevo endpoint vaciar del backend
      setLoading(true);
      try {
        await carritoAPI.vaciar();
        setCartItems([]);
        toast.success('✅ Carrito vaciado');
      } catch (error) {
        console.error("Error al limpiar carrito (backend):", error);
        toast.error('❌ No se pudo vaciar el carrito');
        // Fallback: limpiar localmente
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    } else {
      // Usuario no autenticado: limpiar localStorage
      setCartItems([]);
    }
  };

  // Obtener total de items
  const getCartCount = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => total + (item.cantidad || 1), 0);
  };

  // Obtener subtotal
  const getSubtotal = () => {
    if (!Array.isArray(cartItems)) return 0;
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