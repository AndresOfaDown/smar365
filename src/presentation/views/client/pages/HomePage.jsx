import { useNavigate } from "react-router-dom";
import { FaBolt, FaBox, FaShoppingCart, FaArrowRight, FaStar, FaCheck } from "react-icons/fa";
import { FeaturedProducts } from "../components/FeaturedProducts";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* ========== HERO SECTION ========== */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenido izquierdo */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4">
                <span className="flex items-center gap-3 mb-3">
                  <FaBolt className="text-yellow-400 text-5xl" />
                  SmartSales365
                </span>
                Bienvenido a tu Tienda
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Descubre una amplia variedad de productos de alta calidad, precios competitivos y una experiencia de compra sin igual.
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/cliente/productos")}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-semibold rounded-lg shadow-lg transition transform hover:scale-105"
              >
                <FaShoppingCart />
                Explorar Productos
                <FaArrowRight />
              </button>
              <button
                onClick={() => navigate("/cliente/carrito")}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 hover:border-blue-600 text-gray-900 hover:text-blue-600 text-lg font-semibold rounded-lg transition"
              >
                <FaShoppingCart />
                Mi Carrito
              </button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
              <div>
                <p className="text-3xl font-bold text-blue-600">500+</p>
                <p className="text-sm text-gray-600">Productos</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">10K+</p>
                <p className="text-sm text-gray-600">Clientes Felices</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">24/7</p>
                <p className="text-sm text-gray-600">Soporte</p>
              </div>
            </div>
          </div>

          {/* Contenido derecho - Imagen */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl opacity-20 blur-3xl"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl h-96 flex items-center justify-center">
                <FaBox className="text-8xl text-white opacity-20" />
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <FaCheck className="text-green-500" />
                  <span className="text-gray-800 font-medium">Envío gratis en órdenes mayores a $50</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <FaCheck className="text-green-500" />
                  <span className="text-gray-800 font-medium">Garantía de satisfacción al 100%</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <FaCheck className="text-green-500" />
                  <span className="text-gray-800 font-medium">Devoluciones fáciles y sin complicaciones</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CARACTERÍSTICAS ========== */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          ¿Por qué elegir SmartSales365?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: FaShoppingCart,
              title: "Fácil de usar",
              description: "Interfaz intuitiva y navegación sencilla"
            },
            {
              icon: FaStar,
              title: "Productos Premium",
              description: "Seleccionados y verificados"
            },
            {
              icon: FaBolt,
              title: "Entrega Rápida",
              description: "Envío en 24-48 horas"
            },
            {
              icon: FaCheck,
              title: "Pagos Seguros",
              description: "Múltiples métodos de pago"
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition text-center border border-gray-100"
              >
                <Icon className="text-4xl text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========== PRODUCTOS DESTACADOS ========== */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Productos Destacados
            </h2>
            <p className="text-gray-600 mt-2">Descubre nuestras mejores ofertas</p>
          </div>
          <button
            onClick={() => navigate("/cliente/productos")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            Ver todos
            <FaArrowRight />
          </button>
        </div>

        <FeaturedProducts />
      </section>

      {/* ========== CTA FINAL ========== */}
      <section className="max-w-7xl mx-auto px-6 py-20 mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-12 text-center text-white">
          <h3 className="text-4xl font-bold mb-4">
            ¿Listo para empezar a comprar?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Explora miles de productos con los mejores precios del mercado
          </p>
          <button
            onClick={() => navigate("/cliente/productos")}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            <FaShoppingCart />
            Empezar a Comprar Ahora
            <FaArrowRight />
          </button>
        </div>
      </section>
    </div>
  );
};
