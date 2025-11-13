import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { productosAPI, categoriasAPI, marcasAPI } from '../../../../data/sources/api';
import { ProductCard } from './ProductCard';
import { FaFire } from 'react-icons/fa';

export const FeaturedProducts = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const [productosRes, categoriasRes, marcasRes] = await Promise.all([
          productosAPI.catalogo(),
          categoriasAPI.list(),
          marcasAPI.list(),
        ]);
        
        // Tomar solo los primeros 4 productos como destacados
        setProductos(productosRes.data.slice(0, 4));
        setCategorias(categoriasRes.data);
        setMarcas(marcasRes.data);
        
        // Debug: Ver estructura de datos
        console.log('Primer producto del catálogo:', productosRes.data[0]);
      } catch (err) {
        console.error('Error al cargar productos destacados:', err);
        toast.error('No se pudieron cargar los productos ❌');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  if (loading) {
    return (
      <section className="mt-16">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      </section>
    );
  }

  if (productos.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="flex items-center gap-3 mb-2">
        <FaFire className="text-orange-500 text-2xl" />
        <h2 className="text-3xl font-bold text-gray-800">
          Productos Destacados
        </h2>
      </div>
      <p className="text-gray-600 mb-8">
        Descubre nuestros productos más populares con las mejores ofertas
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos.map((producto) => {
          const categoria = categorias.find((c) => c.id === producto.categoria)?.nombre || 'Sin categoría';
          const marca = marcas.find((m) => m.id === producto.marca)?.nombre || 'Sin marca';
          
          // Debug log para verificar los datos
          console.log('Producto:', {
            id: producto.id,
            nombre: producto.nombre,
            categoria_id: producto.categoria,
            marca_id: producto.marca,
            categoria_nombre: categoria,
            marca_nombre: marca
          });
          
          return (
            <ProductCard
              key={producto.id}
              producto={producto}
              categoria={categoria}
              marca={marca}
            />
          );
        })}
      </div>
    </section>
  );
};
