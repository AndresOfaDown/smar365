import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
    rol_id: "",
  });

  const token = localStorage.getItem("access");

  // 🔹 Obtener usuarios
  const fetchUsuarios = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/getUser/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar usuarios ❌");
    }
  };

  // 🔹 Obtener roles
  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/rol/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data);
    } catch (err) {
      toast.error("Error al cargar roles ❌");
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  // 🔹 Manejar cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Crear usuario
  const handleCreate = async () => {
    try {
      if (!form.nombre || !form.email || !form.password || !form.rol_id) {
        toast.warning("Complete los campos requeridos ⚠️");
        return;
      }

      await axios.post("http://127.0.0.1:8000/api/registro/",
     {
       nombre: form.nombre,
      email: form.email,
      password: form.password,
      telefono: form.telefono,
      direccion: form.direccion,
     rol: parseInt(form.rol_id), // 👈 backend espera "rol", no "rol_id"
     },
    { headers: { Authorization: `Bearer ${token}` } }
    );


      toast.success("Usuario creado ✅");
      setForm({
        nombre: "",
        email: "",
        password: "",
        telefono: "",
        direccion: "",
        rol_id: "",
      });
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      toast.error("Error al crear usuario ❌");
    }
  };

  // 🔹 Editar usuario
  const handleEdit = (usuario) => {
    setModoEdicion(true);
    setUsuarioSeleccionado(usuario.id);
    setForm({
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      rol_id: usuario.rol_id || "",
      password: "",
    });
  };

  // 🔹 Guardar edición
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/user/${usuarioSeleccionado}/update/`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Usuario actualizado ✅");
      setModoEdicion(false);
      setUsuarioSeleccionado(null);
      setForm({
        nombre: "",
        email: "",
        password: "",
        telefono: "",
        direccion: "",
        rol_id: "",
      });
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar usuario ❌");
    }
  };

  // 🔹 Eliminar usuario
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/${id}/elimUser/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Usuario eliminado ✅");
      fetchUsuarios();
    } catch (err) {
      toast.error("Error al eliminar usuario ❌");
    }
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
              onClick={() => {
                setModoEdicion(false);
                setForm({
                  nombre: "",
                  email: "",
                  password: "",
                  telefono: "",
                  direccion: "",
                  rol_id: "",
                });
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* 🔹 Tabla */}
      <table className="min-w-full bg-white border rounded-lg shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Nombre</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Rol</th>
            <th className="py-2 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-t hover:bg-gray-50">
              <td className="py-2 px-4">{u.nombre}</td>
              <td className="py-2 px-4">{u.email}</td>
              <td className="py-2 px-4">{u.rol}</td>
              <td className="py-2 px-4 text-center space-x-2">
                <button
                  onClick={() => handleEdit(u)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
