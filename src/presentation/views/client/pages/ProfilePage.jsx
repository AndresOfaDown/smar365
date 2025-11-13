import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaEdit, FaEnvelope, FaPhone } from 'react-icons/fa';
import api from '../../../../api/axiosConfig';
import * as UsuarioService from '../../../../Services/UsuarioService';
import { ImageUploader } from '../../../../components/ImageUploader';

export const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    foto: '',
  });
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        toast.error("Debes iniciar sesión para ver tu perfil.");
        setLoading(false);
        return;
      }
      
      try {
        const res = await api.get("/perfil/me/");
        setUser(res.data);
        setFormData({
          nombre: res.data.nombre || '',
          apellido: res.data.apellido || '',
          email: res.data.email || '',
          telefono: res.data.telefono || '',
          foto: res.data.foto || '',
        });
      } catch (err) {
        console.error("Error al cargar el perfil:", err);
        toast.error("No se pudo cargar la información del perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await UsuarioService.updateUser(user.id, formData);
      setUser(res.data);
      toast.success("Perfil actualizado correctamente ✅");
      setIsEditing(false);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      toast.error("Error al actualizar el perfil ❌");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-red-500 text-lg">No se pudo cargar el perfil.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FaUserCircle className="text-blue-600" />
              Mi Perfil
            </h1>
            <p className="text-gray-600 mt-1">Gestiona tu información personal</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <FaEdit /> {isEditing ? 'Cancelar' : 'Editar Perfil'}
          </button>
        </div>

        {/* Vista / Edición */}
        {!isEditing ? (
          // Vista Lectura
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Banner con foto */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            
            <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 mb-8">
                {/* Avatar */}
                {formData.foto ? (
                  <img
                    src={formData.foto}
                    alt={formData.nombre}
                    className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <FaUserCircle className="text-6xl text-white" />
                  </div>
                )}
                
                {/* Info básica */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {formData.nombre} {formData.apellido}
                  </h2>
                  <p className="text-gray-600 text-lg mt-1">Usuario del Sistema</p>
                </div>
              </div>

              {/* Información detallada */}
              <div className="border-t border-gray-200 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaEnvelope className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Email</p>
                      <p className="text-gray-900">{formData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FaPhone className="text-green-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Teléfono</p>
                      <p className="text-gray-900">{formData.telefono || 'No especificado'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Vista Edición
          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Información Personal</h2>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Foto de Perfil */}
              <ImageUploader
                value={formData.foto}
                onChange={(url) => setFormData({ ...formData, foto: url })}
                label="Foto de Perfil"
              />

              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Tu apellido"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Email y Teléfono */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-6">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition transform hover:scale-105"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};