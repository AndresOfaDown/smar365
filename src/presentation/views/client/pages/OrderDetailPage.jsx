import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaReceipt, 
  FaArrowLeft,
  FaBox,
  FaFileDownload,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import { ventasAPI } from '../../../../data/sources/api';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarOrden = async () => {
      setLoading(true);
      try {
        const response = await ventasAPI.notaDetalle(id);
        setOrden(response.data);
      } catch (err) {
        console.error('Error al cargar orden:', err);
        toast.error('No se pudo cargar la orden ❌');
        navigate('/cliente/ordenes');
      } finally {
        setLoading(false);
      }
    };
    cargarOrden();
  }, [id, navigate]);

  const handleDescargarPDF = async () => {
    try {
      const response = await ventasAPI.notaPDF(id);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `nota-venta-${id}.pdf`);
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
      <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${config.color}`}>
        <Icon /> {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando orden...</p>
        </div>
      </div>
    );
  }

  if (!orden) {
    return null;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Botón Volver */}
        <button
          onClick={() => navigate('/cliente/ordenes')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 transition"
        >
          <FaArrowLeft />
          Volver a mis órdenes
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <FaReceipt className="text-blue-600" />
                Orden #{orden.id}
              </h1>
              <p className="text-gray-600">
                Fecha: {new Date(orden.fecha).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              {getEstadoBadge(orden.estado)}
              <button
                onClick={handleDescargarPDF}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                <FaFileDownload /> Descargar PDF
              </button>
            </div>
          </div>

          {/* Método de Pago y Total */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 mb-1">Método de Pago</p>
              <p className="text-xl font-bold text-gray-900 capitalize">
                {orden.metodo_pago || 'N/A'}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-gray-600 mb-1">Total Pagado</p>
              <p className="text-4xl font-bold text-green-600">
                ${parseFloat(orden.total || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaBox className="text-blue-600" />
                Productos
              </h2>
              
              {orden.detalles && orden.detalles.length > 0 ? (
                <div className="space-y-4">
                  {orden.detalles.map((detalle, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {detalle.producto_imagen ? (
                          <img
                            src={detalle.producto_imagen}
                            alt={detalle.producto_nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaBox className="text-2xl text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">
                          {detalle.producto_nombre || 'Producto'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Cantidad: <span className="font-semibold">{detalle.cantidad}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Precio unitario: <span className="font-semibold">${parseFloat(detalle.precio_unitario || 0).toFixed(2)}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Subtotal</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ${parseFloat(detalle.subtotal || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay productos en esta orden
                </p>
              )}

              {/* Resumen de Totales */}
              <div className="border-t border-gray-200 mt-6 pt-6 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">Subtotal</span>
                  <span className="font-bold">
                    ${parseFloat(orden.subtotal || orden.total || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">Envío</span>
                  <span className="font-bold text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-gray-900 border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span className="text-green-600">
                    ${parseFloat(orden.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Información de Envío */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600" />
                Información de Envío
              </h2>
              
              {orden.datos_envio ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nombre</p>
                    <p className="font-semibold text-gray-900">
                      {orden.datos_envio.nombre || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <FaEnvelope className="text-blue-600" /> Email
                    </p>
                    <p className="font-semibold text-gray-900">
                      {orden.datos_envio.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <FaPhone className="text-blue-600" /> Teléfono
                    </p>
                    <p className="font-semibold text-gray-900">
                      {orden.datos_envio.telefono || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <FaMapMarkerAlt className="text-blue-600" /> Dirección
                    </p>
                    <p className="font-semibold text-gray-900">
                      {orden.datos_envio.direccion || 'N/A'}
                    </p>
                    {orden.datos_envio.ciudad && (
                      <p className="text-sm text-gray-600">
                        {orden.datos_envio.ciudad}
                        {orden.datos_envio.codigo_postal && `, CP: ${orden.datos_envio.codigo_postal}`}
                      </p>
                    )}
                  </div>
                  {orden.notas && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Notas</p>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {orden.notas}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Sin información de envío
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
