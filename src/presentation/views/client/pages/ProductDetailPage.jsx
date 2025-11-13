import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaShoppingCart, 
  FaStar, 
  FaBox, 
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaShieldAlt
} from 'react-icons/fa';
import * as ProductoService from '../../../../Services/ProductoService';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [producto, setProducto] = useState(null);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [imagenError, setImagenError] = useState(false);

  useEffect(() => {
    const cargarProducto = async () => {
      setLoading(true);
      try {
        const [productoRes, recomendacionesRes] = await Promise.all([
          ProductoService.getProducto(id),
          ProductoService.recomendaciones(id).catch(() => ({ data: [] }))
        ]);
        setProducto(productoRes.data);
        setRecomendaciones(recomendacionesRes.data || []);
      } catch (err) {
        console.error('Error al cargar producto:', err);
        toast.error('No se pudo cargar el producto ❌');
        navigate('/cliente/productos');
      } finally {
        setLoading(false);
      }
    };
    cargarProducto();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    try {
      // Agregar con la cantidad especificada
      for (let i = 0; i < cantidad; i++) {
        await addToCart(producto);
      }
      toast.success(`${cantidad} ${producto.nombre}(s) agregado(s) al carrito ✅`);
      setCantidad(1);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error('No se pudo agregar al carrito ❌');
    }
  };

  const handleIncrementCantidad = () => {
    setCantidad(prev => prev + 1);
  };

  const handleDecrementCantidad = () => {
    if (cantidad > 1) {
      setCantidad(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!producto) {
    return null;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Botón Volver */}
        <button
          onClick={() => navigate('/cliente/productos')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 transition"
        >
          <FaArrowLeft />
          Volver al catálogo
        </button>

        {/* Contenedor Principal */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Imagen del Producto */}
            <div className="relative">
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                {(producto.imagen || producto.dir_img) && !imagenError ? (
                  <img
                    src={producto.imagen || producto.dir_img}
                    alt={producto.nombre}
                    className="w-full h-full object-cover"
                    onError={() => setImagenError(true)}
                  />
                ) : (
                  <FaBox className="text-8xl text-gray-300" />
                )}
              </div>
              
              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {producto.descuento && (
                  <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    -{producto.descuento}% OFF
                  </div>
                )}
                {producto.stock > 0 ? (
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <FaCheckCircle /> En Stock
                  </div>
                ) : (
                  <div className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <FaTimesCircle /> Agotado
                  </div>
                )}
              </div>
            </div>

            {/* Información del Producto */}
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {producto.nombre}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < 4 ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">(23 reseñas)</span>
              </div>

              {/* Precio */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-bold text-green-600">
                    ${parseFloat(producto.precio).toFixed(2)}
                  </p>
                  {producto.descuento && (
                    <p className="text-2xl text-gray-400 line-through">
                      ${(parseFloat(producto.precio) * (1 + producto.descuento / 100)).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">
                  {producto.descripcion || 'Sin descripción disponible.'}
                </p>
              </div>

              {/* Características */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Categoría</p>
                  <p className="font-semibold text-gray-900">{producto.categoria_nombre || 'Sin categoría'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Marca</p>
                  <p className="font-semibold text-gray-900">{producto.marca_nombre || 'Sin marca'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Stock Disponible</p>
                  <p className="font-semibold text-gray-900">{producto.stock} unidades</p>
                </div>
                {producto.garantia && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Garantía</p>
                    <p className="font-semibold text-gray-900">{producto.garantia_nombre || 'Incluida'}</p>
                  </div>
                )}
              </div>

              {/* Selector de Cantidad */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">
                  Cantidad
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={handleDecrementCantidad}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
                      disabled={cantidad <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={producto.stock}
                      value={cantidad}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setCantidad(Math.min(Math.max(val, 1), producto.stock));
                      }}
                      className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                    />
                    <button
                      onClick={handleIncrementCantidad}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
                      disabled={cantidad >= producto.stock}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-600">
                    {producto.stock} disponibles
                  </span>
                </div>
              </div>

              {/* Botón Agregar al Carrito */}
              <button
                onClick={handleAddToCart}
                disabled={producto.stock === 0}
                className={`flex items-center justify-center gap-3 w-full py-4 rounded-lg font-bold text-lg transition transform hover:scale-105 ${
                  producto.stock > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart />
                {producto.stock > 0 ? 'Agregar al Carrito' : 'Producto Agotado'}
              </button>

              {/* Información Adicional */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaTruck className="text-blue-600" />
                  <span className="text-sm">Envío gratis en 24h</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaShieldAlt className="text-blue-600" />
                  <span className="text-sm">Compra protegida</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Productos Recomendados */}
        {recomendaciones.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recomendaciones.slice(0, 4).map((rec) => (
                <ProductCard
                  key={rec.id}
                  producto={rec}
                  categoria={rec.categoria_nombre || 'Sin categoría'}
                  marca={rec.marca_nombre || 'Sin marca'}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
