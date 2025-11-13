import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaSave } from "react-icons/fa";
import api from "../../../api/axiosConfig";
import * as ProductoService from "../../../Services/ProductoService";

export const InventarioPage = () => {
  const [inventario, setInventario] = useState([]);
  const [productos, setProductos] = useState([]);
  
  const [createForm, setCreateForm] = useState({
    producto: "",
    cantidad: "",
  });
  
  const [loading, setLoading] = useState(true);

  // Cargar inventario y productos al montar la página
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [inventarioRes, productosRes] = await Promise.all([
          api.get("inventario/"),
          ProductoService.listProductos(),
        ]);
        
        setInventario(inventarioRes.data);
        setProductos(productosRes.data);

      } catch (err) {
        console.error("Error al cargar datos:", err);
        toast.error("No se pudieron cargar los datos ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      const res = await api.post(
        "inventario/crear/",
        dataAEnviar
      );
      
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
          ? { ...item, cantidad: parseInt(nuevaCantidad) || 0 }
          : item
      )
    );
  };

  // Llama a la API para guardar el cambio de cantidad
  const handleUpdateSubmit = async (inventarioId, cantidad) => {
    try {
      await api.put(
        `inventario/actualizar/${inventarioId}/`,
        { cantidad: parseInt(cantidad) }
      );
      toast.success("Stock actualizado correctamente ✅");
    } catch (err) {
      console.error("Error al actualizar inventario:", err);
      toast.error(err.response?.data?.error || "Error al actualizar stock ❌");
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