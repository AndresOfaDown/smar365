import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaReceipt, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaFileDownload,
  FaEye 
} from 'react-icons/fa';
import * as VentaService from '../../../../Services/VentaService';
import { EmptyState } from '../../../../components/common/EmptyState';

export const OrdersPage = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarOrdenes = async () => {
      setLoading(true);
      try {
        const response = await VentaService.getMisNotas();
        setOrdenes(response.data || []);
      } catch (err) {
        console.error('Error al cargar órdenes:', err);
        toast.error('No se pudieron cargar tus órdenes ❌');
        setOrdenes([]);
      } finally {
        setLoading(false);
      }
    };
    cargarOrdenes();
  }, []);

  const handleDescargarPDF = async (notaId) => {
    try {
      const response = await VentaService.getNotaPDF(notaId);
      // Crear un enlace temporal para descargar el PDF
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `nota-venta-${notaId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF descargado ✅');
    } catch (err) {
      console.error('Error al descargar PDF:', err);
      toast.error('No se pudo descargar el PDF ❌');
    }
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      'pendiente': { icon: FaClock, color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      'completada': { icon: FaCheckCircle, color: 'bg-green-100 text-green-800', text: 'Completada' },
      'cancelada': { icon: FaTimesCircle, color: 'bg-red-100 text-red-800', text: 'Cancelada' },
    };
    const config = estados[estado?.toLowerCase()] || estados['pendiente'];
    const Icon = config.icon;
    return (
      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon /> {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaReceipt className="text-blue-600" />
            Mis Órdenes
          </h1>
          <p className="text-gray-600">Historial de tus compras</p>
        </div>

        {/* Lista de Órdenes */}
        {ordenes.length === 0 ? (
          <EmptyState
            icon={FaReceipt}
            title="No tienes órdenes"
            description="Aún no has realizado ninguna compra"
            action={{
              text: 'Ir a la tienda',
              to: '/cliente/productos'
            }}
          />
        ) : (
          <div className="space-y-6">
            {ordenes.map((orden) => (
              <div
                key={orden.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  {/* Info Principal */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        Orden #{orden.id}
                      </h3>
                      {getEstadoBadge(orden.estado)}
                    </div>
                    <p className="text-gray-600 text-sm">
                      Fecha: {new Date(orden.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${parseFloat(orden.total || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Productos */}
                {orden.detalles && orden.detalles.length > 0 && (
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Productos ({orden.detalles.length})
                    </p>
                    <div className="space-y-2">
                      {orden.detalles.slice(0, 3).map((detalle, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-700">
                            {detalle.producto_nombre || 'Producto'} x {detalle.cantidad}
                          </span>
                          <span className="font-semibold text-gray-900">
                            ${parseFloat(detalle.subtotal || 0).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      {orden.detalles.length > 3 && (
                        <p className="text-xs text-gray-500">
                          + {orden.detalles.length - 3} productos más
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-4">
                  <Link
                    to={`/cliente/ordenes/${orden.id}`}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    <FaEye /> Ver Detalles
                  </Link>
                  <button
                    onClick={() => handleDescargarPDF(orden.id)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    <FaFileDownload /> Descargar PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
