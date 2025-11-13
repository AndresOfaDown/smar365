import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as ProductoService from '../../../../Services/ProductoService';
import * as CategoriaService from '../../../../Services/CategoriaService';
import * as MarcaService from '../../../../Services/MarcaService';
import { ProductCard } from './ProductCard';
import { FaBox } from 'react-icons/fa';

export const ProductGrid = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const [productosRes, categoriasRes, marcasRes] = await Promise.all([
          ProductoService.listProductos(),
          CategoriaService.listCategorias(),
          MarcaService.listMarcas(),
        ]);
        setProductos(productosRes.data);
        setCategorias(categoriasRes.data);
        setMarcas(marcasRes.data);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        toast.error('No se pudieron cargar los productos ❌');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="text-center py-12">
        <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {productos.map((producto) => {
        const categoria = categorias.find((c) => c.id === producto.categoria)?.nombre || 'N/A';
        const marca = marcas.find((m) => m.id === producto.marca)?.nombre || 'N/A';
        
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
  );
};
