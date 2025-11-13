# Services - Capa de Servicios CRUD

Esta carpeta contiene todos los servicios CRUD para interactuar con el backend de la aplicación.

## 📁 Estructura de Servicios

### Usuarios y Autenticación
- **UsuarioService.js** - Gestión de usuarios
- **RolService.js** - Gestión de roles
- **PermisoService.js** - Gestión de permisos
- **ClienteService.js** - Gestión de clientes
- **TecnicoService.js** - Gestión de técnicos

### Productos e Inventario
- **ProductoService.js** - Gestión de productos
- **CategoriaService.js** - Gestión de categorías
- **MarcaService.js** - Gestión de marcas
- **DescuentoService.js** - Gestión de descuentos
- **GarantiaService.js** - Gestión de garantías

### Ventas y Notificaciones
- **VentaService.js** - Gestión de ventas y pagos
- **NotificacionService.js** - Gestión de notificaciones

### Auditoría
- **BitacoraService.js** - Registro de actividades

### Utilidades
- **Cloudinary.jsx** - Gestión de imágenes en la nube

## 🔧 Uso de los Servicios

### Ejemplo básico:

```javascript
import * as UsuarioService from '../Services/UsuarioService';

// Listar usuarios
const usuarios = await UsuarioService.listUsers();

// Crear usuario
const nuevoUsuario = await UsuarioService.createUser({
  nombre: "Juan Pérez",
  email: "juan@example.com",
  password: "123456",
  rol: 2
});

// Actualizar usuario
await UsuarioService.updateUser(1, {
  nombre: "Juan Actualizado"
});

// Eliminar usuario
await UsuarioService.deleteUser(1);
```

### Importación desde el índice:

```javascript
import { UsuarioService, ProductoService } from '../Services';

// Usar los servicios
const usuarios = await UsuarioService.listUsers();
const productos = await ProductoService.listProductos();
```

## 📋 Métodos Comunes

Todos los servicios CRUD siguen un patrón similar:

- **list()** - Obtener lista completa
- **get(id)** - Obtener por ID
- **create(data)** - Crear nuevo registro
- **update(id, data)** - Actualizar registro
- **delete(id)** - Eliminar registro

## 🔗 Rutas del Backend

Todas las rutas están configuradas en `src/data/sources/api.js` y apuntan a:
- Base URL: `http://127.0.0.1:8000/api/`
- Autenticación: Bearer Token (JWT)

## 🛡️ Manejo de Errores

Los servicios no manejan errores directamente. Se recomienda usar try-catch en los componentes:

```javascript
try {
  const data = await UsuarioService.listUsers();
  // Éxito
} catch (error) {
  console.error("Error:", error);
  // Manejo de error
}
```

## 📝 Notas

- Todos los servicios usan Axios configurado con interceptores
- El token JWT se adjunta automáticamente en cada petición
- Las rutas están alineadas con las URLs del backend Django
