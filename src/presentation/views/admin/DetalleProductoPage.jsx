import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Para obtener el id del producto desde la URL

export const DetalleProductoPage= () => {
  const { id } = useParams();  // Obtener el id del producto desde la URL
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar los detalles del producto cuando se monta el componente
  const fetchProductoDetalle = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/productos/${id}/`);
      setProducto(res.data); // Guardamos los datos del producto en el estado
    } catch (err) {
      console.error("Error al cargar el producto:", err);
    } finally {
      setLoading(false);  // Dejar de mostrar el cargando una vez que la respuesta llegue
    }
  };

  useEffect(() => {
    fetchProductoDetalle(); // Llamada a la API al montar el componente
  }, [id]);  // Ejecutar cuando el `id` cambia

  // Mostrar un mensaje de carga mientras se obtienen los detalles
  if (loading) {
    return <p className="text-gray-500">Cargando detalles del producto...</p>;
  }

  // Si no se encuentra el producto, mostrar mensaje
  if (!producto) {
    return <p className="text-red-500">Producto no encontrado.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Detalles del Producto</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-medium">{producto.nombre}</h3>
        
        <div className="mt-4">
          <p><strong>Descripción:</strong> {producto.descripcion}</p>
          <p><strong>Precio:</strong> ${producto.precio}</p>
          <p><strong>Marca:</strong> {producto.marca}</p>
          <p><strong>Categoría:</strong> {producto.categoria}</p>
          <p><strong>Stock:</strong> {producto.stock}</p>
          
          {/* Si tienes más detalles del producto, puedes agregar aquí */}
        </div>

        {/* Puedes agregar un botón para ir atrás o editar el producto */}
        <div className="mt-6 flex justify-between">
          <a
            href="/admin/productos"
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Volver
          </a>
          {/* Aquí puedes agregar más botones si es necesario, por ejemplo para editar */}
          <a
            href={`/admin/productos/editar/${producto.id}`}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Editar
          </a>
        </div>
      </div>
    </div>
  );
};
