import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaRobot, FaBrain, FaChartLine, FaChartBar, FaChartPie } from "react-icons/fa";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import { api } from "../../../data/sources/api";

const PREDICCION_API_URL_BASE = "ia";
const REPORTES_API_URL_BASE = "reportes/dinamico/";

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const DashboardPage = () => {
  const [prediccionesData, setPrediccionesData] = useState([]);
  const [ventasClienteData, setVentasClienteData] = useState([]);
  const [ventasProductoData, setVentasProductoData] = useState([]);
  
  const [modeloStats, setModeloStats] = useState(null);
  const [prediccionResultados, setPrediccionResultados] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingEntrenar, setLoadingEntrenar] = useState(false);
  const [loadingPredecir, setLoadingPredecir] = useState(false);

  // --- 1. Cargar TODOS los datos del Dashboard al inicio ---
  const fetchAllDashboardData = async () => {
    setLoading(true);
    try {
      const [resPredicciones, resVentasCliente, resVentasProducto] = await Promise.all([
        api.get(`${PREDICCION_API_URL_BASE}/dashboard/`),
        api.post(REPORTES_API_URL_BASE, 
          { prompt: "agrupado por cliente" }
        ),
        api.post(REPORTES_API_URL_BASE, 
          { prompt: "agrupado por producto" }
        )
      ]);

      const dataFormateada = resPredicciones.data.map(item => ({
        ...item,
        valor_predicho: parseFloat(item.valor_predicho)
      }));
      setPrediccionesData(dataFormateada);

      // Procesar datos de Ventas por Cliente (Gráfica de Barras)
      const dataClientes = (resVentasCliente.data.reporte || []).map(item => ({
        ...item,
        total_vendido: parseFloat(item.total_vendido)
      }));
      setVentasClienteData(dataClientes);

      // Procesar datos de Ventas por Producto (Gráfica de Pastel)
       const dataProductos = (resVentasProducto.data.reporte || []).map(item => ({
        name: item.producto, // 'name' es requerido por el PieChart
        value: parseFloat(item.total_vendido) // 'value' es requerido por el PieChart
      }));
      setVentasProductoData(dataProductos);

    } catch (err) {
      console.error("Error al cargar dashboard:", err);
      toast.error("Error al cargar datos del dashboard ❌");
    } finally {
      setLoading(false);
    }
  };

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    fetchAllDashboardData();
  }, [token]);

  // --- 2. Acción de Entrenar (POST /entrenar/) ---
  const handleEntrenar = async () => {
    setLoadingEntrenar(true);
    setModeloStats(null);
    try {
      const res = await api.post(
        `${PREDICCION_API_URL_BASE}/entrenar/`,
        {}
      );
      setModeloStats({ mse: res.data.mse, r2: res.data.r2 });
      toast.success(res.data.mensaje || "Modelo entrenado ✅");
    } catch (err) {
      console.error("Error al entrenar:", err);
      toast.error("Error al entrenar el modelo ❌");
    } finally {
      setLoadingEntrenar(false);
    }
  };

  // --- 3. Acción de Predecir (POST /predecir/) ---
  const handlePredecir = async () => {
    setLoadingPredecir(true);
    setPrediccionResultados([]);
    try {
      const res = await api.post(
        `${PREDICCION_API_URL_BASE}/predecir/`,
        {}
      );
      setPrediccionResultados(res.data.resultados);
      toast.success(res.data.mensaje || "Predicciones generadas ✅");
      fetchAllDashboardData();
    } catch (err) {
      console.error("Error al predecir:", err);
      toast.error("Error al generar predicciones ❌");
    } finally {
      setLoadingPredecir(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3 mb-6">
        <FaChartLine />
        Dashboard de Predicciones y Ventas
      </h2>

      {/* --- Contenedor de Gráficas --- */}
      {loading ? (
        <p className="text-center text-gray-500">Cargando gráficas...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Gráfica de Predicciones (Línea) */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Predicciones de Ventas Futuras</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={prediccionesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periodo" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Line type="monotone" dataKey="valor_predicho" name="Predicción" stroke="#8884D8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfica de Ventas por Cliente (Barras) */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Ventas Históricas por Cliente</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={ventasClienteData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cliente" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="total_vendido" name="Total Vendido" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfica de Ventas por Producto (Pastel) */}
          <div className="bg-white rounded-lg shadow p-6 col-span-1 lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-center">Ventas Históricas por Producto</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={ventasProductoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => `${entry.name} ($${entry.value.toFixed(2)})`}
                  >
                    {ventasProductoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* --- Acciones (Entrenar y Predecir) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card para Entrenar */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaBrain />
            Entrenar Modelo
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Vuelve a entrenar el modelo de IA con los datos más recientes.
          </p>
          <button
            onClick={handleEntrenar}
            disabled={loadingEntrenar}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingEntrenar ? "Entrenando..." : "Iniciar Entrenamiento"}
          </button>
          {modeloStats && (
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <p className="text-sm font-medium">Resultados del Entrenamiento:</p>
              <p className="text-xs">MSE: {modeloStats.mse}</p>
              <p className="text-xs">R²: {modeloStats.r2}</p>
            </div>
          )}
        </div>

        {/* Card para Predecir */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaRobot />
            Generar Nuevas Predicciones
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Usa el modelo entrenado para generar las predicciones de ventas futuras.
          </p>
          <button
            onClick={handlePredecir}
            disabled={loadingPredecir}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loadingPredecir ? "Generando..." : "Generar Predicciones"}
          </button>
        </div>
      </div>

      {/* --- Tabla de Resultados de Predicción (Opcional) --- */}
      {prediccionResultados.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-auto">
          <h3 className="text-xl font-semibold p-6">Nuevas Predicciones Generadas (Datos)</h3>
          <table className="min-w-full divide-y divide-gray-200">
            {/* ... (la tabla que ya teníamos) ... */}
          </table>
        </div>
      )}
    </div>
  );
};