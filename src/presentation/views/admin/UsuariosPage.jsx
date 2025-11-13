import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import * as RolService from "../../../Services/RolService";
import * as UsuarioService from "../../../Services/UsuarioService";
import { ConfirmDialog } from "../../components/ConfirmDialog";

export const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
    rol_id: "",
  });

  // 🔹 Obtener usuarios y roles
  const fetchData = async () => {
    try {
      const [usuariosRes, rolesRes] = await Promise.all([
        UsuarioService.listUsers(),
        RolService.listRoles(),
      ]);
      setUsuarios(usuariosRes.data);
      setRoles(rolesRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar datos ❌");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Manejar cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Crear usuario
  const handleCreate = async () => {
    try {
      // Validaciones detalladas
      if (!form.nombre.trim()) {
        toast.warning("El nombre es obligatorio ⚠️");
        return;
      }
      if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
        toast.warning("El correo electrónico no es válido ⚠️");
        return;
      }
      if (!form.password.trim() || form.password.length < 6) {
        toast.warning("La contraseña debe tener al menos 6 caracteres ⚠️");
        return;
      }
      if (form.telefono && form.telefono.trim() && !/^\d{7,15}$/.test(form.telefono.trim())) {
        toast.warning("El teléfono debe tener entre 7 y 15 dígitos ⚠️");
        return;
      }
      if (!form.rol_id) {
        toast.warning("Debe seleccionar un rol ⚠️");
        return;
      }

      const userData = {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
        telefono: form.telefono.trim() || "",
        direccion: form.direccion.trim() || "",
        rol: parseInt(form.rol_id, 10),
      };

      await UsuarioService.createUser(userData);
      toast.success("Usuario creado ✅");
      await fetchData();
      resetForm();
    } catch (err) {
      console.error("Error al crear usuario:", err);
      const errorMessage = err.response?.data?.email?.[0] || err.response?.data?.message || "Error al crear usuario";
      toast.error(`Error: ${errorMessage} ❌`);
    }
  };

  // 🔹 Resetear formulario
  const resetForm = () => {
    setForm({
      nombre: "",
      email: "",
      password: "",
      telefono: "",
      direccion: "",
      rol_id: "",
    });
    setModoEdicion(false);
    setUsuarioSeleccionado(null);
  };

  // 🔹 Editar usuario
  const handleEdit = async (usuario) => {
    try {
      setModoEdicion(true);
      setUsuarioSeleccionado(usuario.id);
      
      // Recargar usuario desde servidor para tener datos actualizados
      const res = await UsuarioService.getUser(usuario.id);
      const u = res.data || usuario;

      // Normalizar distintos posibles campos (rol puede venir como número o como ID)
      const rolId = u.rol || "";

      // Recargar lista de roles para asegurar que la selección esté actualizada
      try {
        const rolesRes = await RolService.listRoles();
        setRoles(rolesRes.data || []);
      } catch (rolesErr) {
        console.error('Error al recargar roles:', rolesErr);
      }

      setForm({
        nombre: u.nombre || "",
        email: u.email || "",
        telefono: u.telefono || "",
        direccion: u.direccion || "",
        rol_id: rolId,
        password: "",
      });
    } catch (err) {
      console.error('Error al cargar usuario para edición:', err);
      toast.error("Error al cargar datos del usuario ❌");
    }
  };

  // 🔹 Guardar edición
  const handleUpdate = async () => {
    try {
      // Validaciones
      if (!form.nombre.trim()) {
        toast.warning("El nombre es obligatorio ⚠️");
        return;
      }
      if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
        toast.warning("El correo electrónico no es válido ⚠️");
        return;
      }
      if (form.telefono && form.telefono.trim() && !/^\d{7,15}$/.test(form.telefono.trim())) {
        toast.warning("El teléfono debe tener entre 7 y 15 dígitos ⚠️");
        return;
      }

      const updateData = {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim() || "",
        direccion: form.direccion.trim() || "",
      };
      
      await UsuarioService.updateUser(usuarioSeleccionado, updateData);
      toast.success("Usuario actualizado ✅");
      await fetchData();
      resetForm();
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      const errorMessage = err.response?.data?.message || "Error al actualizar usuario";
      toast.error(`Error: ${errorMessage} ❌`);
    }
  };

  // 🔹 Mostrar confirmación de eliminación
  const handleDeleteClick = (usuario) => {
    setUserToDelete(usuario);
    setShowConfirmDialog(true);
  };

  // 🔹 Confirmar eliminación
  const confirmDelete = async () => {
    try {
      await UsuarioService.deleteUser(userToDelete.id);
      toast.success("Usuario eliminado ✅");
      await fetchData();
      setShowConfirmDialog(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      toast.error("Error al eliminar usuario ❌");
    }
  };

  // 🔹 Cancelar eliminación
  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setUserToDelete(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Gestión de Usuarios
        </h2>
      </div>

      {/* 🔹 Formulario */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-3">
          {modoEdicion ? "Editar Usuario" : "Crear Usuario"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />
          {!modoEdicion && (
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />
          )}
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={form.direccion}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />
          <select
            name="rol_id"
            value={form.rol_id}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">-- Seleccione Rol --</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          {modoEdicion ? (
            <button
              onClick={handleUpdate}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mr-2"
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2"
            >
              <FaPlus className="inline mr-1" /> Crear Usuario
            </button>
          )}
          {modoEdicion && (
            <button
              onClick={resetForm}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* 🔹 Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Nombre</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Teléfono</th>
              <th className="py-2 px-4 text-left">Dirección</th>
              <th className="py-2 px-4 text-left">Estado</th>
              <th className="py-2 px-4 text-left">Rol</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const rolNombre = u.rol_nombre || "-";
              return (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{u.id}</td>
                  <td className="py-2 px-4">{u.nombre}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4">{u.telefono || "-"}</td>
                  <td className="py-2 px-4">{u.direccion || "-"}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      u.estado === 1 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {u.estado === 1 ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-2 px-4">{rolNombre}</td>
                  <td className="py-2 px-4 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(u)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 🔹 Diálogo de Confirmación */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Confirmar Eliminación"
        message={`¿Está seguro que desea eliminar al usuario ${userToDelete?.nombre}? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};
