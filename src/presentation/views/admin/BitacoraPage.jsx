import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaBell } from "react-icons/fa";
import { api } from "../../../data/sources/api";

export const BitacoraPage = () => {
  const [bitacora, setBitacora] = useState([]);
  const [filtro, setFiltro] = useState("");

  // 🔹 Obtener registros de bitácora
  const fetchBitacora = async () => {
    try {
      const res = await api.get("getBitacora/");
      setBitacora(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar bitácora ❌");
    }
  };

  useEffect(() => {
    fetchBitacora();
  }, []);

  // 🔍 Filtrar registros (por nombre, correo o acción)
  const registrosFiltrados = bitacora.filter((b) =>
    [b.nombre, b.correo, b.accion]
      .join(" ")
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );

  return (
    <div className="pt-2 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        Bitácora de Actividades
      </h2>

      {/* 🔹 Filtro de búsqueda */}
      <div className="flex items-center gap-2 mb-5">
        <FaBell className="text-2xl text-gray-700" />
        <input
          type="text"
          placeholder="Buscar por usuario, correo o acción..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border rounded-lg px-3 py-2 w-1/2 focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* 🔹 Tabla */}
      <div className="overflow-x-auto bg-white border rounded-lg shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Usuario</th>
              <th className="py-2 px-4 text-left">Correo</th>
              <th className="py-2 px-4 text-left">Acción</th>
              <th className="py-2 px-4 text-left">IP</th>
              <th className="py-2 px-4 text-left">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {registrosFiltrados.length > 0 ? (
              registrosFiltrados.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{item.nombre || "—"}</td>
                  <td className="py-2 px-4">{item.correo || "—"}</td>
                  <td className="py-2 px-4">{item.accion}</td>
                  <td className="py-2 px-4">{item.ip || "—"}</td>
                  <td className="py-2 px-4">
                    {item.fecha
                      ? new Date(item.fecha.replace(" ", "T")).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No se encontraron registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
