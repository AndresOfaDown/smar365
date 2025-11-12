import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

export const HomeCliente = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // ✅ Recuperar token del login
  const token = localStorage.getItem("access");

  // ✅ Obtener productos del backend
  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/productos/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProductos(res.data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
  };

  // ✅ Obtener categorías del backend
  const fetchCategorias = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/categorias/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategorias(res.data);
    } catch (err) {
      console.error("Error al obtener categorías:", err);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  // 🔍 Filtrar productos por búsqueda y categoría
  const productosFiltrados = (productos || []).filter((p) => {
    const nombreProducto = (p.nombre || "").toLowerCase();
    const coincideCategoria =
      !filtroCategoria || p.categoria_nombre === filtroCategoria;
    const coincideBusqueda = nombreProducto.includes(
      (busqueda || "").toLowerCase()
    );
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="px-10 py-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold text-blue-800 mb-6">
        🛍️ Catálogo de Productos
      </h2>

      {/* 🔹 Barra de búsqueda y filtros */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Búsqueda */}
        <div className="relative flex items-center">
          <FaSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border pl-10 pr-4 py-2 rounded-lg w-64 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filtro por categoría */}
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.nombre}>
              {cat.nombre}
            </option>
          ))}
        </select>

        {/* Botón limpiar filtros */}
        <button
          onClick={() => {
            setBusqueda("");
            setFiltroCategoria("");
          }}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg text-sm"
        >
          Limpiar
        </button>
      </div>

      {/* 🔹 Lista de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all flex flex-col"
            >
              <img
                src={p.imagen || "https://placehold.co/200x200?text=Sin+Imagen"}
                alt={p.nombre}
                className="h-40 w-full object-cover rounded-md mb-3"
              />
              <h3 className="font-semibold text-gray-800">{p.nombre}</h3>
              <p className="text-sm text-gray-500 mb-1">
                {p.categoria_nombre || "Sin categoría"}
              </p>
              <p className="text-blue-700 font-semibold mb-3">
                ${parseFloat(p.precio).toFixed(2)}
              </p>
              <button className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition">
                Agregar al carrito 🛒
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No hay productos disponibles.
          </p>
        )}
      </div>

      {/* 🔹 Botón de cerrar sesión */}
      <div className="mt-10 text-center">
        <button
          onClick={() => {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("usuario");
            window.location.href = "/";
          }}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        >
          Cerrar sesión 🔒
        </button>
      </div>
    </div>
  );
};
