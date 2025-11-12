import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaEdit } from 'react-icons/fa';

export const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        toast.error("Debes iniciar sesión para ver tu perfil.");
        setLoading(false);
        return;
      }
      
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/perfil/me/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error al cargar el perfil:", err);
        toast.error("No se pudo cargar la información del perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Cargando perfil...</p>;
  }

  if (!user) {
    return <p className="text-center text-red-500 py-10">No se pudo cargar el perfil.</p>;
  }

  // Si todo está bien, muestra la información
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          Mi Perfil
        </h2>
        {/* Este botón asumirá que tienes una ruta para editar, como la de admin */}
        <Link
          to={`/cliente/perfil/editar/${user.id}`} // O una ruta '/cliente/editar-perfil'
          className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FaEdit />
          Editar Perfil
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-6 mb-8">
          <FaUserCircle className="text-8xl text-gray-300" />
          <div>
            <h3 className="text-4xl font-bold text-gray-900">
              {user.nombre} {user.apellido || ""}
            </h3>
            <p className="text-xl text-gray-500">
              Cliente
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Nombre Completo</dt>
              <dd className="mt-1 text-lg text-gray-900">{user.nombre} {user.apellido || ""}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-lg text-gray-900">{user.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd className="mt-1 text-lg text-gray-900">{user.telefono || "N/A"}</dd>
            </div>
            {/* Puedes añadir más campos que te devuelva la API */}
          </dl>
        </div>
      </div>
    </div>
  );
};