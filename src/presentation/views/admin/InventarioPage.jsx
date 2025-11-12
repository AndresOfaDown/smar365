import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaSave } from "react-icons/fa";

export const InventarioPage = () => {
  // Estado para la lista de inventario existente
  const [inventario, setInventario] = useState([]);
  // Estado para la lista de productos (para el dropdown de "Crear")
  const [productos, setProductos] = useState([]);
  
  // Estado para el formulario de "Crear"
  const [createForm, setCreateForm] = useState({
    producto: "", // ID del producto
    cantidad: "",
  });
  
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  // Cargar inventario y productos al montar la página
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [inventarioRes, productosRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/inventario/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/api/productos/", { // Asumo esta ruta para listar productos
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        
        // Asumo que 'listar_inventario' devuelve [{id, producto_nombre, cantidad}]
        // O [{id, producto: {id, nombre}, cantidad}]
        // O [{id, producto: "Nombre Producto", cantidad: 10}] (basado en 'listar_garantias')
        setInventario(inventarioRes.data); 
        setProductos(productosRes.data); // Lista de todos los productos

      } catch (err) {
        console.error("Error al cargar datos:", err);
        toast.error("No se pudieron cargar los datos ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // --- LÓGICA DE CREAR INVENTARIO ---

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    const dataAEnviar = {
      producto: parseInt(createForm.producto),
      cantidad: parseInt(createForm.cantidad),
    };

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/inventario/crear/",
        dataAEnviar,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Asumo que la API devuelve el objeto creado, (ej: {id, producto: "Nombre", cantidad})
      // o { mensaje: "...", inventario: {...} } como en 'crear_garantia'
      const nuevoInventario = res.data.inventario || res.data; 

      setInventario((prev) => [...prev, nuevoInventario]);
      toast.success(res.data.mensaje || "Inventario creado ✅");
      setCreateForm({ producto: "", cantidad: "" });
    } catch (err) {
      console.error("Error al crear inventario:", err);
      toast.error(err.response?.data?.error || "Error al crear inventario ❌");
    }
  };

  // --- LÓGICA DE ACTUALIZAR INVENTARIO ---

  // Maneja el cambio de cantidad en la *tabla*
  const handleQuantityChange = (inventarioId, nuevaCantidad) => {
    setInventario((prevInventario) =>
      prevInventario.map((item) =>
        item.id === inventarioId
          ? { ...item, cantidad: parseInt(nuevaCantidad) || 0 } // Actualiza localmente
          : item
      )
    );
  };

  // Llama a la API para guardar el cambio de cantidad
  const handleUpdateSubmit = async (inventarioId, cantidad) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/inventario/actualizar/${inventarioId}/`,
        { cantidad: parseInt(cantidad) }, // La API 'actualizar' solo necesita la cantidad
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Stock actualizado correctamente ✅");
    } catch (err) {
      console.error("Error al actualizar inventario:", err);
      toast.error(err.response?.data?.error || "Error al actualizar stock ❌");
      // Opcional: Volver a cargar los datos para revertir el cambio local si falla
      // fetchInventario(); 
    }
  };

  // --- RENDER ---

  if (loading) {
    return <p className="text-center text-gray-500">Cargando...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Gestión de Inventario
      </h2>

      {/* --- Formulario de CREAR --- */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-3">Crear Nueva Entrada de Inventario</h3>
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Producto</label>
            <select
              name="producto"
              value={createForm.producto}
              onChange={handleCreateChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
              required
            >
              <option value="">Seleccione un producto</option>
              {/* Asumo que 'productos' es una lista de {id, nombre} */}
              {productos.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad Inicial</label>
            <input
              type="number"
              name="cantidad"
              value={createForm.cantidad}
              onChange={handleCreateChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
              placeholder="Ej: 100"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <FaPlus /> Crear Inventario
          </button>
        </form>
      </div>

      {/* --- Tabla de ACTUALIZAR --- */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-3">Inventario Actual</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad (Stock)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventario.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {/* Asumo que 'listar_inventario' devuelve 'producto' como string (nombre) */}
                  {item.producto} 
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={item.cantidad}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg w-24"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleUpdateSubmit(item.id, item.cantidad)}
                    className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <FaSave /> Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};