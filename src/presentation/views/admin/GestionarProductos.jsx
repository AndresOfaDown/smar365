import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaBox } from "react-icons/fa";
import * as ProductoService from "../../../Services/ProductoService";
import * as CategoriaService from "../../../Services/CategoriaService";
import * as MarcaService from "../../../Services/MarcaService";
import * as DescuentoService from "../../../Services/DescuentoService";
import * as GarantiaService from "../../../Services/GarantiaService";
import { ImageUploader } from "../../../components/ImageUploader";

export const GestionarProductos = () => {
  // ========== ESTADO LISTA Y FILTROS ==========
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [descuentos, setDescuentos] = useState([]);
  const [garantias, setGarantias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterMarca, setFilterMarca] = useState("");

  // ========== ESTADO FORMULARIO ==========
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    imagen: "",
    categoria: "",
    marca: "",
    descuento: "",
    garantia: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  // 🔹 Cargar todos los datos al montar
  const fetchData = async () => {
    setLoading(true);
    try {
      const [productosRes, categoriasRes, marcasRes, descuentosRes, garantiasRes] = await Promise.all([
        ProductoService.listProductos(),
        CategoriaService.listCategorias(),
        MarcaService.listMarcas(),
        DescuentoService.listDescuentos(),
        GarantiaService.listGarantias(),
      ]);
      setProductos(productosRes.data);
      setFilteredProductos(productosRes.data);
      setCategorias(categoriasRes.data);
      setMarcas(marcasRes.data);
      setDescuentos(descuentosRes.data);
      setGarantias(garantiasRes.data);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      toast.error("No se pudieron cargar los datos ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Filtrar productos
  useEffect(() => {
    let filtered = productos;

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategoria) {
      filtered = filtered.filter((p) => p.categoria == filterCategoria);
    }

    if (filterMarca) {
      filtered = filtered.filter((p) => p.marca == filterMarca);
    }

    setFilteredProductos(filtered);
  }, [searchTerm, filterCategoria, filterMarca, productos]);

  // 🔹 Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Limpiar formulario
  const resetForm = () => {
    setFormData({
      nombre: "",
      precio: "",
      descripcion: "",
      imagen: "",
      categoria: "",
      marca: "",
      descuento: "",
      garantia: "",
    });
    setEditingId(null);
  };

  // 🔹 Abrir formulario para crear
  const handleOpenCreate = () => {
    resetForm();
    setShowForm(true);
  };

  // 🔹 Abrir formulario para editar
  const handleOpenEdit = async (id) => {
    try {
      const res = await ProductoService.getProducto(id);
      setFormData({
        nombre: res.data.nombre || "",
        precio: res.data.precio || "",
        descripcion: res.data.descripcion || "",
        imagen: res.data.imagen || "",
        categoria: res.data.categoria || "",
        marca: res.data.marca || "",
        descuento: res.data.descuento || "",
        garantia: res.data.garantia || "",
      });
      setEditingId(id);
      setShowForm(true);
    } catch (err) {
      console.error("Error al cargar producto:", err);
      toast.error("Error al cargar el producto ❌");
    }
  };

  // 🔹 Crear o actualizar producto
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.precio || !formData.categoria || !formData.marca) {
      toast.warning("Complete los campos requeridos ⚠️");
      return;
    }

    setFormLoading(true);

    const productoData = {
      nombre: formData.nombre,
      precio: formData.precio,
      descripcion: formData.descripcion,
      imagen: formData.imagen,
      categoria: formData.categoria,
      marca: formData.marca,
      garantia: formData.garantia === "" ? null : parseInt(formData.garantia),
    };

    try {
      if (editingId) {
        // Actualizar
        await ProductoService.updateProducto(editingId, productoData);
        setProductos(
          productos.map((p) =>
            p.id === editingId ? { ...p, ...productoData } : p
          )
        );
        toast.success("Producto actualizado correctamente ✅");
      } else {
        // Crear
        const res = await ProductoService.createProducto(productoData);
        setProductos([...productos, res.data]);
        toast.success("Producto creado correctamente ✅");
      }
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error("Error:", err);
      toast.error(editingId ? "Error al actualizar el producto ❌" : "Error al crear el producto ❌");
    } finally {
      setFormLoading(false);
    }
  };

  // 🔹 Eliminar producto
  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

    try {
      await ProductoService.deleteProducto(id);
      setProductos(productos.filter((p) => p.id !== id));
      toast.success("Producto eliminado correctamente ✅");
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      toast.error("Error al eliminar el producto ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* ========== HEADER ========== */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FaBox className="text-blue-600" />
              Gestión de Productos
            </h1>
            <p className="text-gray-600 mt-1">Administra tu catálogo de productos</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <FaPlus /> Nuevo Producto
          </button>
        </div>

        {/* ========== BUSCADOR Y FILTROS ========== */}
        <div className="bg-white rounded-lg shadow p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

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

      {/* ========== FORMULARIO DE CREAR/EDITAR ========== */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingId ? "Editar Producto" : "Crear Nuevo Producto"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre del producto"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Precio *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-500 font-semibold">$</span>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              >
                <option value="">Selecciona categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Marca *
              </label>
              <select
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              >
                <option value="">Selecciona marca</option>
                {marcas.map((marca) => (
                  <option key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Descuento */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descuento
              </label>
              <select
                name="descuento"
                value={formData.descuento}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                <option value="">Sin Descuento</option>
                {descuentos.map((desc) => (
                  <option key={desc.id} value={desc.id}>
                    {desc.nombre} ({desc.porcentaje}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Garantía */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Garantía
              </label>
              <select
                name="garantia"
                value={formData.garantia}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                <option value="">Sin Garantía</option>
                {garantias.map((gar) => (
                  <option key={gar.id} value={gar.id}>
                    {gar.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción del producto..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              />
            </div>

            {/* Image Uploader */}
            <div className="md:col-span-2">
              <ImageUploader
                value={formData.imagen}
                onChange={(url) => setFormData({ ...formData, imagen: url })}
                label="Imagen del Producto"
              />
            </div>

            {/* Botones */}
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition transform hover:scale-105 disabled:scale-100"
              >
                {formLoading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingId ? "Actualizando..." : "Creando..."}
                  </>
                ) : editingId ? (
                  "Guardar Cambios"
                ) : (
                  "Crear Producto"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========== TABLA DE PRODUCTOS ========== */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {filteredProductos.length === 0 ? (
            <div className="p-8 text-center">
              <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No se encontraron productos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Imagen</th>
                    <th className="px-6 py-4 text-left font-semibold">Nombre</th>
                    <th className="px-6 py-4 text-left font-semibold">Precio</th>
                    <th className="px-6 py-4 text-left font-semibold">Categoría</th>
                    <th className="px-6 py-4 text-left font-semibold">Marca</th>
                    <th className="px-6 py-4 text-center font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProductos.map((producto) => (
                    <tr key={producto.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        {producto.imagen ? (
                          <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <FaBox className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {producto.nombre}
                      </td>
                      <td className="px-6 py-4 text-green-600 font-semibold">
                        ${parseFloat(producto.precio).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {categorias.find((c) => c.id == producto.categoria)?.nombre || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {marcas.find((m) => m.id == producto.marca)?.nombre || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center space-x-3">
                        <button
                          onClick={() => handleOpenEdit(producto.id)}
                          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                        >
                          <FaEdit /> Editar
                        </button>
                        <button
                          onClick={() => handleDelete(producto.id)}
                          className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                        >
                          <FaTrash /> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
