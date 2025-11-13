import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSearch, FaBox } from 'react-icons/fa';
import { productosAPI, categoriasAPI, marcasAPI } from '../../../../data/sources/api';
import { ProductCard } from '../components/ProductCard';

export const ProductListPage = () => {
  const [search, setSearch] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterMarca, setFilterMarca] = useState('');
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
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
        setProductos(productosRes.data);
        setFilteredProductos(productosRes.data);
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

  // Aplicar filtros
  useEffect(() => {
    let filtered = productos;

    if (search) {
      filtered = filtered.filter((p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterCategoria) {
      filtered = filtered.filter((p) => p.categoria == filterCategoria);
    }

    if (filterMarca) {
      filtered = filtered.filter((p) => p.marca == filterMarca);
    }

    setFilteredProductos(filtered);
  }, [search, filterCategoria, filterMarca, productos]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaBox className="text-blue-600" />
            Catálogo de Productos
          </h1>
          <p className="text-gray-600">Explora nuestros productos disponibles</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar producto..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filtro Categoría */}
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>

            {/* Filtro Marca */}
            <select
              value={filterMarca}
              onChange={(e) => setFilterMarca(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="">Todas las marcas</option>
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Productos */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredProductos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {search || filterCategoria || filterMarca
                ? 'No se encontraron productos con esos filtros'
                : 'No hay productos disponibles'}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-6">
              Mostrando <span className="font-bold text-blue-600">{filteredProductos.length}</span> productos
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProductos.map((producto) => {
                const categoria = categorias.find((c) => c.id === producto.categoria)?.nombre || 'Sin categoría';
                const marca = marcas.find((m) => m.id === producto.marca)?.nombre || 'Sin marca';
                
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
          </div>
        )}
      </div>
    </section>
  );
};
