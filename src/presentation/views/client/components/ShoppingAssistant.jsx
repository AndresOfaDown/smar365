import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaMicrophone, FaTimes, FaPaperPlane, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { sendMessageToGemini, startVoiceRecognition, speakText } from '../../../../Services/Geminii/ApiGemini';
import { WELCOME_MESSAGE } from '../../../../Services/Geminii/promt';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export const ShoppingAssistant = ({ productos, categorias, marcas, onSearch, onFilterCategoria, onFilterMarca }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const { addToCart, removeFromCart, updateQuantity, clearCart, cartItems } = useCart();
  const navigate = useNavigate();

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mensaje de bienvenida dinámico
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = `¡Hola! 👋 Soy SmartBot, tu asistente de compras.

✅ Conexión establecida con el sistema:
📦 ${productos.length} productos disponibles
📁 ${categorias.length} categorías
🏷️ ${marcas.length} marcas
🛒 Carrito: ${cartItems.length} items

Puedo ayudarte a:
• Agregar productos al carrito ("añade 2 cafés")
• Ver tu carrito ("muéstrame mi carrito")
• Buscar productos ("busca laptops")
• Filtrar por categoría o marca

¿En qué puedo ayudarte hoy?`;
      
      setMessages([{ type: 'bot', text: welcomeMsg, timestamp: new Date() }]);
    }
  }, [isOpen, productos.length, categorias.length, marcas.length, cartItems.length]);

  // Procesar comandos especiales del bot
  const processCommand = async (botResponse) => {
    // Buscar producto por nombre (función auxiliar)
    const findProductByName = (nombre) => {
      return productos.find(p => 
        p.nombre.toLowerCase().includes(nombre.toLowerCase())
      );
    };

    // AGREGAR:[nombre]:[cantidad]
    if (botResponse.includes('AGREGAR:')) {
      const match = botResponse.match(/AGREGAR:([^:]+):(\d+)/);
      if (match) {
        const nombreProducto = match[1].trim();
        const cantidad = parseInt(match[2]);
        const producto = findProductByName(nombreProducto);
        
        if (producto) {
          try {
            // Agregar la cantidad especificada
            for (let i = 0; i < cantidad; i++) {
              await addToCart(producto);
            }
            toast.success(`${cantidad} ${producto.nombre}(s) agregado(s) al carrito ✅`);
            return botResponse.replace(/AGREGAR:[^:]+:\d+/, '').trim() || 
                   `He agregado ${cantidad} ${producto.nombre}(s) a tu carrito. ¿Necesitas algo más?`;
          } catch {
            return 'Lo siento, hubo un problema al agregar el producto al carrito.';
          }
        } else {
          return `No encontré un producto llamado "${nombreProducto}". ¿Podrías ser más específico?`;
        }
      }
    }

    // ELIMINAR:[nombre]:[cantidad]
    if (botResponse.includes('ELIMINAR:') && !botResponse.includes('ELIMINAR_TODOS:')) {
      const match = botResponse.match(/ELIMINAR:([^:]+):(\d+)/);
      if (match) {
        const nombreProducto = match[1].trim();
        const cantidadAEliminar = parseInt(match[2]);
        const producto = findProductByName(nombreProducto);
        
        if (producto) {
          const itemEnCarrito = cartItems.find(item => item.id === producto.id);
          
          if (itemEnCarrito) {
            const nuevaCantidad = Math.max(0, (itemEnCarrito.cantidad || 1) - cantidadAEliminar);
            
            if (nuevaCantidad === 0) {
              await removeFromCart(producto.id);
              toast.success(`${producto.nombre} eliminado del carrito ✅`);
              return botResponse.replace(/ELIMINAR:[^:]+:\d+/, '').trim() || 
                     `He eliminado ${producto.nombre} de tu carrito.`;
            } else {
              await updateQuantity(producto.id, nuevaCantidad);
              toast.success(`Cantidad actualizada: ${nuevaCantidad} ${producto.nombre}(s) ✅`);
              return botResponse.replace(/ELIMINAR:[^:]+:\d+/, '').trim() || 
                     `He reducido la cantidad a ${nuevaCantidad} ${producto.nombre}(s).`;
            }
          } else {
            return `No tienes ${producto.nombre} en tu carrito.`;
          }
        } else {
          return `No encontré un producto llamado "${nombreProducto}".`;
        }
      }
    }

    // ELIMINAR_TODOS:[nombre]
    if (botResponse.includes('ELIMINAR_TODOS:')) {
      const match = botResponse.match(/ELIMINAR_TODOS:([^\n]+)/);
      if (match) {
        const nombreProducto = match[1].trim();
        const producto = findProductByName(nombreProducto);
        
        if (producto) {
          const itemEnCarrito = cartItems.find(item => item.id === producto.id);
          
          if (itemEnCarrito) {
            await removeFromCart(producto.id);
            toast.success(`Todos los ${producto.nombre} eliminados del carrito ✅`);
            return botResponse.replace(/ELIMINAR_TODOS:[^\n]+/, '').trim() || 
                   `He eliminado todos los ${producto.nombre} de tu carrito.`;
          } else {
            return `No tienes ${producto.nombre} en tu carrito.`;
          }
        } else {
          return `No encontré un producto llamado "${nombreProducto}".`;
        }
      }
    }

    // ACTUALIZAR:[nombre]:[cantidad]
    if (botResponse.includes('ACTUALIZAR:')) {
      const match = botResponse.match(/ACTUALIZAR:([^:]+):(\d+)/);
      if (match) {
        const nombreProducto = match[1].trim();
        const nuevaCantidad = parseInt(match[2]);
        const producto = findProductByName(nombreProducto);
        
        if (producto) {
          const itemEnCarrito = cartItems.find(item => item.id === producto.id);
          
          if (itemEnCarrito) {
            await updateQuantity(producto.id, nuevaCantidad);
            toast.success(`Cantidad actualizada: ${nuevaCantidad} ${producto.nombre}(s) ✅`);
            return botResponse.replace(/ACTUALIZAR:[^:]+:\d+/, '').trim() || 
                   `He actualizado la cantidad a ${nuevaCantidad} ${producto.nombre}(s).`;
          } else {
            // Si no está en el carrito, agregarlo con la cantidad especificada
            for (let i = 0; i < nuevaCantidad; i++) {
              await addToCart(producto);
            }
            toast.success(`${nuevaCantidad} ${producto.nombre}(s) agregado(s) al carrito ✅`);
            return botResponse.replace(/ACTUALIZAR:[^:]+:\d+/, '').trim() || 
                   `He agregado ${nuevaCantidad} ${producto.nombre}(s) a tu carrito.`;
          }
        } else {
          return `No encontré un producto llamado "${nombreProducto}".`;
        }
      }
    }

    // VACIAR_CARRITO
    if (botResponse.includes('VACIAR_CARRITO')) {
      await clearCart();
      toast.success('Carrito vaciado ✅');
      return botResponse.replace(/VACIAR_CARRITO/, '').trim() || 
             'He vaciado tu carrito completamente.';
    }

    // FILTRAR_CATEGORIA:NOMBRE
    if (botResponse.includes('FILTRAR_CATEGORIA:')) {
      const match = botResponse.match(/FILTRAR_CATEGORIA:([^\n]+)/);
      if (match) {
        const categoriaNombre = match[1].trim();
        const categoria = categorias.find(c => 
          c.nombre.toLowerCase().includes(categoriaNombre.toLowerCase())
        );
        if (categoria && onFilterCategoria) {
          onFilterCategoria(categoria.id);
          return botResponse.replace(/FILTRAR_CATEGORIA:[^\n]+/, '').trim() || 
                 `He filtrado los productos por la categoría "${categoria.nombre}".`;
        }
      }
    }

    // FILTRAR_MARCA:NOMBRE
    if (botResponse.includes('FILTRAR_MARCA:')) {
      const match = botResponse.match(/FILTRAR_MARCA:([^\n]+)/);
      if (match) {
        const marcaNombre = match[1].trim();
        const marca = marcas.find(m => 
          m.nombre.toLowerCase().includes(marcaNombre.toLowerCase())
        );
        if (marca && onFilterMarca) {
          onFilterMarca(marca.id);
          return botResponse.replace(/FILTRAR_MARCA:[^\n]+/, '').trim() || 
                 `He filtrado los productos por la marca "${marca.nombre}".`;
        }
      }
    }

    // BUSCAR:TERMINO
    if (botResponse.includes('BUSCAR:')) {
      const match = botResponse.match(/BUSCAR:([^\n]+)/);
      if (match) {
        const searchTerm = match[1].trim();
        if (onSearch) {
          onSearch(searchTerm);
          return botResponse.replace(/BUSCAR:[^\n]+/, '').trim() || 
                 `He buscado productos con el término "${searchTerm}".`;
        }
      }
    }

    // VER_CARRITO
    if (botResponse.includes('VER_CARRITO')) {
      navigate('/cliente/carrito');
      return 'Te he dirigido a tu carrito de compras.';
    }

    return botResponse;
  };

  // Enviar mensaje de texto
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { type: 'user', text: userMessage, timestamp: new Date() }]);
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(userMessage, productos, categorias, marcas, cartItems);
      const processedResponse = await processCommand(response);
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: processedResponse, 
        timestamp: new Date() 
      }]);
      
      // Hablar la respuesta
      speakText(processedResponse);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'Lo siento, tuve un problema al procesar tu solicitud. ¿Podrías intentarlo de nuevo?', 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Activar reconocimiento de voz
  const handleVoiceInput = async () => {
    setIsListening(true);
    try {
      const transcript = await startVoiceRecognition();
      setInputText(transcript);
      toast.success('¡Mensaje de voz capturado! 🎤');
    } catch (error) {
      console.error('Error en reconocimiento de voz:', error);
      toast.error(error.message || 'Error al capturar voz ❌');
    } finally {
      setIsListening(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 z-50 animate-pulse"
          aria-label="Asistente de compras"
        >
          <FaRobot className="text-3xl" />
        </button>
      )}

      {/* Ventana de chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaRobot className="text-2xl" />
              <div>
                <h3 className="font-bold">SmartBot</h3>
                <p className="text-xs opacity-90">Tu asistente de compras</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition"
            >
              <FaTimes />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <button
                onClick={handleVoiceInput}
                disabled={isListening || isLoading}
                className={`p-3 rounded-lg transition ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                aria-label="Entrada de voz"
              >
                <FaMicrophone />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe o habla tu mensaje..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Enviar mensaje"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
