import { FaStar, FaBox } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export const ProductCard = ({ producto, categoria, marca }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(producto);
      toast.success(`${producto.nombre} agregado al carrito ✅`);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  // Asegurar que siempre tengamos valores válidos
  const categoriaTexto = categoria || 'Sin categoría';
  const marcaTexto = marca || 'Sin marca';
  const precioTexto = producto?.precio ? parseFloat(producto.precio).toFixed(2) : '0.00';
  const imagenUrl = producto?.imagen || producto?.dir_img || null;

  return (
    <Link
      to={`/cliente/productos/${producto.id}`}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group cursor-pointer block"
    >
      {/* Imagen */}
      <div className="relative overflow-hidden bg-gray-100 h-56">
        {imagenUrl ? (
          <img
            src={imagenUrl}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-200"><svg class="text-4xl text-gray-400 w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"></path></svg></div>';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <FaBox className="text-4xl text-gray-400" />
          </div>
        )}
        {/* Badge de descuento (opcional) */}
        {producto.descuento && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            -{producto.descuento}%
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Categoría y Marca */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {categoriaTexto}
          </span>
          {marcaTexto !== 'Sin marca' && (
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {marcaTexto}
            </span>
          )}
        </div>

        {/* Nombre */}
        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600">
          {producto.nombre}
        </h3>

        {/* Descripción */}
        {producto.descripcion && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
            {producto.descripcion}
          </p>
        )}

        {/* Rating (opcional) */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`text-xs ${
                i < 4 ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-xs text-gray-600 ml-1">(23)</span>
        </div>

        {/* Precio */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-green-600">
              Bs. {precioTexto}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition transform hover:scale-105"
          >
            Agregar
          </button>
        </div>
      </div>
    </Link>
  );
};
