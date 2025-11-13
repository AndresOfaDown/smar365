import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDgfQ4t8UYTbTmDFUe5x5kq4pipk2PMnnQ";
const genAI = new GoogleGenerativeAI(API_KEY);

// Modelo de IA actualizado (gemini-pro ya no está disponible)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Envía un mensaje al asistente de compras de Gemini
 * @param {string} message - Mensaje del usuario
 * @param {Array} productos - Lista de productos disponibles
 * @param {Array} categorias - Lista de categorías
 * @param {Array} marcas - Lista de marcas
 * @returns {Promise<string>} - Respuesta del asistente
 */
export const sendMessageToGemini = async (message, productos = [], categorias = [], marcas = [], carritoActual = []) => {
  try {
    // Verificar que tenemos datos
    console.log('📊 Datos enviados a Gemini:', {
      productos: productos.length,
      categorias: categorias.length,
      marcas: marcas.length,
      carrito: carritoActual.length
    });

    // Validar que hay productos
    if (!productos || productos.length === 0) {
      return "Aún estoy cargando los productos. Por favor, espera un momento e intenta de nuevo.";
    }

    // Crear lista de productos disponibles con nombres exactos
    const productosDisponibles = productos.map(p => ({
      nombre: p.nombre,
      id: p.id,
      precio: p.precio
    }));
    
    const productosLista = productosDisponibles.map(p => `"${p.nombre}"`).join(', ');
    
    // Resumen del carrito
    const carritoResumen = carritoActual.length > 0 
      ? carritoActual.map(item => `${item.nombre} (cantidad: ${item.cantidad})`).join(', ')
      : 'vacío';

    // Lista de categorías y marcas
    const categoriasLista = categorias && categorias.length > 0 
      ? categorias.map(c => c.nombre).join(', ')
      : 'Sin categorías';
    const marcasLista = marcas && marcas.length > 0
      ? marcas.map(m => m.nombre).join(', ')
      : 'Sin marcas';

    const prompt = `Eres SmartBot, asistente de compras con ACCESO DIRECTO A LA BASE DE DATOS de SmartSales365.

📊 DATOS EN TIEMPO REAL DE LA BASE DE DATOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Productos (${productos.length}): ${productosLista}
📁 Categorías (${categorias.length}): ${categoriasLista}
🏷️ Marcas (${marcas.length}): ${marcasLista}
🛒 Carrito actual: ${carritoResumen}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CAPACIDADES - CRUD COMPLETO EN LA BASE DE DATOS:

✅ CREATE (Agregar al carrito):
   Comando: AGREGAR:NombreExacto:cantidad
   Ejemplo: "añade 5 cafés" → "AGREGAR:Cafe:5"
   Esto INSERTA registros en la tabla carrito_detalle

✅ READ (Consultar):
   - "qué productos hay" → lista todos los productos de la BD
   - "muéstrame mi carrito" → muestra registros de carrito_detalle
   - "busca laptops" → BUSCAR:laptop

✅ UPDATE (Actualizar cantidades):
   Comando: ACTUALIZAR:NombreExacto:nuevaCantidad
   Ejemplo: "deja solo 3 cafés" → "ACTUALIZAR:Cafe:3"
   Esto ACTUALIZA registros en carrito_detalle

✅ DELETE (Eliminar):
   - Eliminar cantidad: ELIMINAR:NombreExacto:cantidad
   - Eliminar todos: ELIMINAR_TODOS:NombreExacto
   - Vaciar carrito: VACIAR_CARRITO
   Esto BORRA registros de carrito_detalle

FORMATO DE COMANDOS (ejecutan queries en la BD):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGREGAR:Cafe:5          → INSERT 5 cafés
ELIMINAR:Cafe:2         → DELETE 2 cafés
ELIMINAR_TODOS:Cafe     → DELETE todos los cafés
ACTUALIZAR:Cafe:10      → UPDATE cantidad a 10
VACIAR_CARRITO          → DELETE * FROM carrito
VER_CARRITO             → SELECT * FROM carrito
BUSCAR:laptop           → SELECT * WHERE nombre LIKE '%laptop%'
FILTRAR_CATEGORIA:nombre → SELECT * WHERE categoria = nombre
FILTRAR_MARCA:nombre    → SELECT * WHERE marca = nombre

REGLAS CRÍTICAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Usa el nombre EXACTO del producto de la lista (respeta mayúsculas)
2. Para comandos CRUD: responde SOLO el comando, sin texto extra
3. Para consultas: responde con los datos de la BD que te di arriba
4. Si el producto no existe en la BD: "No encontré ese producto"

Usuario: "${message}"
Respuesta:`;

    console.log('📤 Enviando request a Gemini...');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const respuestaIA = response.text().trim();
    
    console.log('✅ Respuesta de Gemini:', respuestaIA);
    
    return respuestaIA;
  } catch (error) {
    console.error("❌ Error completo:", error);
    console.error("❌ Error mensaje:", error.message);
    console.error("❌ Error stack:", error.stack);
    
    // Mensajes de error más específicos
    if (error.message.includes('API key')) {
      return "Error: Clave de API inválida. Por favor verifica la configuración.";
    }
    if (error.message.includes('quota')) {
      return "Error: Se ha excedido la cuota de la API. Intenta más tarde.";
    }
    if (error.message.includes('network')) {
      return "Error de conexión. Verifica tu conexión a internet.";
    }
    
    return `Lo siento, tuve un problema al procesar tu solicitud. Error: ${error.message}`;
  }
};

/**
 * Convierte audio a texto usando Web Speech API
 * @returns {Promise<string>} - Texto transcrito
 */
export const startVoiceRecognition = () => {
  return new Promise((resolve, reject) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      reject(new Error('Tu navegador no soporta reconocimiento de voz'));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };

    recognition.onerror = (event) => {
      reject(new Error(`Error en reconocimiento de voz: ${event.error}`));
    };

    recognition.start();
  });
};

/**
 * Convierte texto a voz
 * @param {string} text - Texto a convertir en voz
 */
export const speakText = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }
};

export default {
  sendMessageToGemini,
  startVoiceRecognition,
  speakText,
};