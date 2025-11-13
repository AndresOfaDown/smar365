import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";
import * as NotificacionService from "../../../Services/NotificacionService";
import * as UsuarioService from "../../../Services/UsuarioService";

export const NotificacionesPage = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    mensaje: "",
    usuario_id: "",
  });

  // 🔹 Cargar notificaciones
  const fetchNotificaciones = async () => {
    try {
      const res = await NotificacionService.listNotificaciones();
      setNotificaciones(res.data);
    } catch (err) {
      toast.error("Error al cargar notificaciones ❌");
    }
  };

  // 🔹 Cargar usuarios
  const fetchUsuarios = async () => {
    try {
      const res = await UsuarioService.listUsers();
      setUsuarios(res.data);
    } catch (err) {
      toast.error("Error al cargar usuarios ❌");
    }
  };

  useEffect(() => {
    fetchNotificaciones();
    fetchUsuarios();
  }, []);

  // 🔹 Manejar formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Crear notificación
  const handleCreate = async () => {
    try {
      if (!form.titulo || !form.mensaje || !form.usuario_id) {
        toast.warning("Completa todos los campos ⚠️");
        return;
      }

      await NotificacionService.createNotificacion({
        titulo: form.titulo,
        mensaje: form.mensaje,
        usuario_id: parseInt(form.usuario_id),
      });

      toast.success("Notificación enviada ✅");
      setForm({ titulo: "", mensaje: "", usuario_id: "" });
      fetchNotificaciones();
    } catch (err) {
      console.error(err);
      toast.error("Error al enviar la notificación ❌");
    }
  };

  // 🔹 Eliminar notificación
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta notificación?")) return;
    try {
      await NotificacionService.deleteNotificacion(id);
      toast.success("Notificación eliminada ✅");
      fetchNotificaciones();
    } catch (err) {
      toast.error("Error al eliminar notificación ❌");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Gestión de Notificaciones
      </h2>

      {/* 🔹 Formulario */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-3">Enviar Nueva Notificación</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="titulo"
            placeholder="Título"
            value={form.titulo}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />
          <select
            name="usuario_id"
            value={form.usuario_id}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">-- Seleccione Usuario --</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <textarea
          name="mensaje"
          placeholder="Mensaje de la notificación"
          value={form.mensaje}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 w-full mt-3"
          rows={4}
        />

        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-3"
        >
          <FaPlus className="inline mr-1" /> Enviar Notificación
        </button>
      </div>

      {/* 🔹 Tabla */}
      <table className="min-w-full bg-white border rounded-lg shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Título</th>
            <th className="py-2 px-4 text-left">Mensaje</th>
            <th className="py-2 px-4 text-left">Usuario</th>
            <th className="py-2 px-4 text-left">Fecha</th>
            <th className="py-2 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notificaciones.map((n) => (
            <tr key={n.id} className="border-t hover:bg-gray-50">
              <td className="py-2 px-4">{n.titulo}</td>
              <td className="py-2 px-4">{n.mensaje}</td>
              <td className="py-2 px-4">
                {n.usuario?.nombre || "—"}
              </td>
              <td className="py-2 px-4">
                {new Date(n.fecha_envio || n.fecha_creada).toLocaleString()}
              </td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => handleDelete(n.id)}
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
