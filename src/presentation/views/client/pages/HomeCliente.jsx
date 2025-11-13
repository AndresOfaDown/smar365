import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSearch, FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import { productosAPI, categoriasAPI, marcasAPI } from "../../../../data/sources/api";
import { ProductCard } from "../components/ProductCard";

export const HomeCliente = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  // Obtener datos del usuario
  useEffect(() => {
    const usuarioData = localStorage.getItem("usuario");
    if (usuarioData) {
      try {
        setUsuario(JSON.parse(usuarioData));
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    }
  }, []);

  // Obtener productos, categorías y marcas
  const fetchData = async () => {
    setLoading(true);
    try {
      const [productosRes, categoriasRes, marcasRes] = await Promise.all([
        productosAPI.list(),
        categoriasAPI.list(),
        marcasAPI.list(),
      ]);
      setProductos(productosRes.data || []);
      setCategorias(categoriasRes.data || []);
      setMarcas(marcasRes.data || []);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      toast.error("Error al cargar los productos ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrar productos
  const productosFiltrados = productos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = !filtroCategoria || p.categoria == filtroCategoria;
    return coincideNombre && coincideCategoria;
  });

  // Obtener nombre de categoría
  const getNombreCategoria = (id) => {
    return categorias.find((c) => c.id == id)?.nombre || "Sin categoría";
  };

  // Obtener nombre de marca
  const getNombreMarca = (id) => {
    return marcas.find((m) => m.id == id)?.nombre || "";
  };

  // Cerrar sesión
  const handleLogout = () => {
    if (window.confirm("¿Deseas cerrar sesión?")) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("usuario");
      toast.success("Sesión cerrada ✅");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* ========== HEADER BIENVENIDA ========== */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              ¡Bienvenido, {usuario?.nombre || "Cliente"}! 👋
            </h1>
            <p className="text-blue-100">
              Explora nuestros productos y encuentra lo que buscas
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
            >
              <FaUser />
              Perfil
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition font-semibold"
            >
              <FaSignOutAlt />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* ========== CONTENIDO PRINCIPAL ========== */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Buscador y Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Catálogo de Productos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Filtro por categoría */}
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>

            {/* Botón limpiar */}
            <button
              onClick={() => {
                setBusqueda("");
                setFiltroCategoria("");
              }}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition"
            >
              Limpiar Filtros
            </button>
          </div>

          {/* Resultados */}
          <p className="text-sm text-gray-600 mt-4">
            {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s" : ""} encontrado{productosFiltrados.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Grid de Productos */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : productosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                categoria={getNombreCategoria(producto.categoria)}
                marca={getNombreMarca(producto.marca)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 mb-6">
              Intenta ajustar tus filtros de búsqueda
            </p>
            <button
              onClick={() => {
                setBusqueda("");
                setFiltroCategoria("");
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
