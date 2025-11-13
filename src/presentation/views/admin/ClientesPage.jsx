import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaUsers, FaPlus, FaSearch, FaUser } from "react-icons/fa";
import { clientesAPI } from "../../../data/sources/api";
import { ImageUploader } from "../../../components/ImageUploader";

export const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    foto: "",
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  // Filtrar clientes
  useEffect(() => {
    const filtered = clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClientes(filtered);
  }, [searchTerm, clientes]);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const res = await clientesAPI.list();
      setClientes(res.data);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
      toast.error("No se pudieron cargar los clientes ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!form.nombre || !form.email) {
      toast.warning("Complete los campos requeridos ⚠️");
      return;
    }

    try {
      const res = await clientesAPI.create(form);
      setClientes([...clientes, res.data]);
      toast.success("Cliente creado correctamente ✅");
      setForm({ nombre: "", apellido: "", email: "", telefono: "", foto: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error al crear cliente:", err);
      toast.error("Error al crear el cliente ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FaUsers className="text-blue-600" />
              Gestión de Clientes
            </h1>
            <p className="text-gray-600 mt-1">Administra tu base de datos de clientes</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <FaPlus /> Nuevo Cliente
          </button>
        </div>

        {/* Buscador */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Formulario para crear cliente */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Nuevo Cliente</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del cliente"
                value={form.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Apellido
              </label>
              <input
                type="text"
                name="apellido"
                placeholder="Apellido del cliente"
                value={form.apellido}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                placeholder="+1 (555) 000-0000"
                value={form.telefono}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Foto */}
            <div className="md:col-span-2">
              <ImageUploader
                value={form.foto}
                onChange={(url) => setForm({ ...form, foto: url })}
                label="Foto de Perfil del Cliente"
              />
            </div>

            {/* Botones */}
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition transform hover:scale-105"
              >
                Guardar Cliente
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm({ nombre: "", apellido: "", email: "", telefono: "", foto: "" });
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de clientes */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {filteredClientes.length === 0 ? (
            <div className="p-8 text-center">
              <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No se encontraron clientes</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Foto</th>
                    <th className="px-6 py-4 text-left font-semibold">Nombre</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Teléfono</th>
                    <th className="px-6 py-4 text-center font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClientes.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        {cliente.foto ? (
                          <img
                            src={cliente.foto}
                            alt={cliente.nombre}
                            className="w-12 h-12 object-cover rounded-full border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                            <FaUser className="text-white" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {cliente.nombre} {cliente.apellido || ""}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{cliente.email}</td>
                      <td className="px-6 py-4 text-gray-600">{cliente.telefono || "N/A"}</td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/admin/clientes/detalles/${cliente.id}`}
                          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                        >
                          Ver Detalles
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};