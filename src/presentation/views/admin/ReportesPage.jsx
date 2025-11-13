import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { FaFilePdf, FaFileExcel, FaChartBar, FaMicrophone } from "react-icons/fa";
import api from "../../../api/axiosConfig";

export const ReportesPage = () => {
  const [prompt, setPrompt] = useState("");
  const [reporteData, setReporteData] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const speechRecognitionRef = useRef(null);

  // --- NUEVO: useEffect para configurar el reconocimiento de voz ---
  useEffect(() => {
    // Comprueba si el navegador soporta la API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.warn("Tu navegador no soporta el reconocimiento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Solo graba una vez
    recognition.lang = 'es-ES';      // Configura el idioma a español
    recognition.interimResults = false; // Solo queremos el resultado final

    // Evento: cuando se obtiene un resultado
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript); // Pone el texto reconocido en el textarea
      toast.success("Comando de voz reconocido.");
    };

    // Evento: cuando termina de escuchar
    recognition.onend = () => {
      setIsListening(false);
    };

    // Evento: si hay un error
    recognition.onerror = (event) => {
      console.error("Error de reconocimiento de voz:", event.error);
      toast.error(`Error de voz: ${event.error}`);
      setIsListening(false);
    };
    
    // Guarda la instancia en la referencia
    speechRecognitionRef.current = recognition;

  }, []); // El array vacío asegura que esto solo se ejecute una vez

  // Función para capitalizar los encabezados de la tabla
  const capitalizar = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
  };

  // --- MANEJADOR PRINCIPAL ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReporteData([]); // Limpia la tabla anterior
    setColumnas([]);

    const promptLimpio = prompt.toLowerCase();
    const esDescarga = promptLimpio.includes("pdf") || promptLimpio.includes("excel");

    try {
      if (esDescarga) {
        const res = await api.post(
          "reportes/dinamico/",
          { prompt },
          {
            responseType: 'blob',
          }
        );

        const esPdf = promptLimpio.includes("pdf");
        const filename = esPdf ? "reporte.pdf" : "reporte.xlsx";
        const contentType = esPdf 
          ? "application/pdf" 
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        const url = window.URL.createObjectURL(new Blob([res.data], { type: contentType }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        toast.success("Descarga del reporte iniciada ✅");

      } else {
        const res = await api.post(
          "reportes/dinamico/",
          { prompt }
        );

        const data = res.data.reporte || [];

        if (data.length > 0) {
          setColumnas(Object.keys(data[0]));
          setReporteData(data);
          toast.success("Reporte generado en pantalla ✅");
        } else {
          toast.info("No se encontraron datos para ese reporte.");
        }
      }
    } catch (err) {
      console.error("Error al generar reporte:", err);
      // Intentar leer el error incluso si es un blob
      let errorMsg = "Error al generar el reporte ❌";
      if (err.response && err.response.data) {
        if (err.response.data.error) {
           errorMsg = err.response.data.error;
        } else if (err.response.data instanceof Blob) {
           try {
             // Si el error es un blob (pasa en descargas), intenta leerlo como JSON
             const errorJson = JSON.parse(await err.response.data.text());
             errorMsg = errorJson.error || errorMsg;
           } catch(e) {
             // No se pudo leer el blob, usa el mensaje genérico
           }
        }
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // --- NUEVA FUNCIÓN: Para manejar el clic en el micrófono ---
  const handleListen = () => {
    if (!speechRecognitionRef.current || isListening) {
      return;
    }
    try {
      speechRecognitionRef.current.start();
      setIsListening(true);
      toast.info("¡Escuchando... habla ahora!");
    } catch (err) {
      console.error("Error al iniciar la escucha:", err);
      toast.error("No se pudo iniciar el micrófono.");
    }
  };


  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3 mb-6">
        <FaChartBar />
        Generador de Reportes Dinámicos
      </h2>

      {/* --- Formulario de Prompt --- */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <form onSubmit={handleSubmit}>
          {/* --- CAMBIO: Añadido botón de micrófono --- */}
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Escribe tu consulta
            </label>
            <button
              type="button" // Importante: no es 'submit'
              onClick={handleListen}
              disabled={isListening || !speechRecognitionRef.current}
              className={`py-1 px-3 rounded-lg flex items-center gap-2 transition-colors ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } disabled:opacity-50`}
            >
              {isListening ? (
                <>Escuchando...</>
              ) : (
                <><FaMicrophone /> Grabar</>
              )}
            </button>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
            rows="3"
            placeholder="Ej: 'ventas de octubre agrupado por cliente en pdf' o 'ventas mayores a 500 del cliente victo'"
            required
          />
          <div className="text-xs text-gray-500 mt-2 mb-4">
            Palabras clave: "pdf", "excel", "agrupado por producto", "agrupado por cliente", "cliente [nombre]", "[mes]", "[fecha] a [fecha]", "mayor a [monto]".
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? "Generando..." : "Generar Reporte"}
          </button>
        </form>
      </div>

      {/* --- Tabla de Resultados (Solo para reportes "en pantalla") --- */}
      {loading && (
        <p className="text-center text-gray-500">Cargando reporte...</p>
      )}

      {reporteData.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columnas.map((col) => (
                  <th key={col} className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {capitalizar(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reporteData.map((fila, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columnas.map((col) => (
                    <td key={col} className="px-6 py-4 whitespace-nowrap text-sm">
                      {/* Formato especial para 'total_vendido' */}
                      {col.includes('total_vendido') 
                        ? `$${parseFloat(fila[col]).toFixed(2)}`
                        : fila[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};