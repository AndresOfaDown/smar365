# 🤖 Asistente de Compras con IA - SmartSales365

## Descripción
Asistente virtual inteligente que ayuda a los usuarios a gestionar su carrito de compras mediante **texto y voz** utilizando Google Gemini AI.

## Características

### ✅ Funcionalidades Implementadas

1. **Chat en Tiempo Real**
   - Interfaz de chat moderna y responsive
   - Mensajes de usuario y bot diferenciados
   - Auto-scroll a los últimos mensajes

2. **Reconocimiento de Voz**
   - Captura comandos de voz en español
   - Botón de micrófono con indicador visual
   - Conversión automática de voz a texto

3. **Síntesis de Voz**
   - El bot responde con voz
   - Idioma: Español (es-ES)
   - Velocidad y tono ajustados

4. **Comandos Inteligentes**
   - `AGREGAR_AL_CARRITO:[ID]` - Agrega productos al carrito
   - `FILTRAR_CATEGORIA:[NOMBRE]` - Filtra por categoría
   - `FILTRAR_MARCA:[NOMBRE]` - Filtra por marca
   - `BUSCAR:[TERMINO]` - Busca productos
   - `VER_CARRITO` - Redirige al carrito

## Uso

### Por Texto
1. Haz clic en el botón flotante del robot 🤖
2. Escribe tu mensaje (ejemplos):
   - "Muéstrame productos de electrónica"
   - "Busca laptops"
   - "Agrégame el producto 5 al carrito"
   - "¿Qué categorías tienen?"

### Por Voz
1. Abre el asistente
2. Haz clic en el botón del micrófono 🎤
3. Habla tu comando
4. El texto se capturará automáticamente

## Integración

### ProductListPage
```jsx
import { ShoppingAssistant } from '../components/ShoppingAssistant';

<ShoppingAssistant
  productos={productos}
  categorias={categorias}
  marcas={marcas}
  onSearch={setSearch}
  onFilterCategoria={setFilterCategoria}
  onFilterMarca={setFilterMarca}
/>
```

### API de Gemini
```javascript
import { sendMessageToGemini, startVoiceRecognition, speakText } from './Services/Geminii/ApiGemini';

const response = await sendMessageToGemini(message, productos, categorias, marcas);
```

## Configuración

### API Key de Gemini
La API key está configurada en `ApiGemini.js`:
```javascript
const API_KEY = "AIzaSyC-HcuBdspoPkwrgpSlEsV7DvDcJTPtOYw";
```

⚠️ **Importante**: En producción, usa variables de entorno:
```javascript
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```

## Requisitos del Navegador

- **Reconocimiento de Voz**: Chrome, Edge, Safari
- **Síntesis de Voz**: Todos los navegadores modernos
- **JavaScript**: ES6+

## Arquitectura

```
Services/
  Geminii/
    ├── ApiGemini.js      # Integración con Gemini AI
    └── promt.js          # Prompts del sistema

components/
  └── ShoppingAssistant.jsx  # Componente principal del chat
```

## Flujo de Trabajo

1. Usuario abre el asistente
2. Usuario escribe o habla un comando
3. El mensaje se envía a Gemini AI con contexto (productos, categorías, marcas)
4. Gemini analiza el mensaje y genera una respuesta
5. El sistema procesa comandos especiales (agregar al carrito, filtrar, etc.)
6. La respuesta se muestra y se convierte a voz

## Ejemplos de Comandos

```
Usuario: "Muéstrame laptops"
Bot: BUSCAR:laptops
Acción: Filtra productos con "laptops"

Usuario: "Agrégame ese producto al carrito"
Bot: AGREGAR_AL_CARRITO:5
Acción: Agrega producto ID 5 al carrito

Usuario: "¿Qué marcas tienen?"
Bot: "Tenemos las siguientes marcas: Samsung, Apple, HP..."
Acción: Lista marcas disponibles

Usuario: "Filtra por Samsung"
Bot: FILTRAR_MARCA:Samsung
Acción: Filtra productos de Samsung
```

## Mejoras Futuras

- [ ] Soporte multiidioma
- [ ] Historial de conversaciones
- [ ] Recomendaciones personalizadas basadas en historial
- [ ] Procesamiento de imágenes (enviar fotos de productos)
- [ ] Integración con sistema de pagos por voz
- [ ] Análisis de sentimientos del usuario
- [ ] Respuestas contextuales mejoradas

## Notas de Desarrollo

- El asistente mantiene contexto de productos disponibles
- Los comandos especiales se procesan antes de mostrar la respuesta
- La voz del bot se puede silenciar desde la configuración del navegador
- El chat persiste mientras la página esté abierta

## Créditos

- **IA**: Google Gemini Pro
- **Reconocimiento de Voz**: Web Speech API
- **Síntesis de Voz**: Web Speech API
- **Framework**: React 19
- **Iconos**: React Icons
