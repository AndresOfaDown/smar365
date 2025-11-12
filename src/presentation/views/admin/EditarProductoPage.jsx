import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const EditarProductoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  // --- CAMBIO: Añadido 'garantia' al estado ---
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    imagen: "",
    categoria: "",
    marca: "",
    descuento: "",
    garantia: "", // <-- NUEVO CAMPO
  });

  // Estados para las listas de los dropdowns
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [descuentos, setDescuentos] = useState([]);
  const [garantias, setGarantias] = useState([]); // <-- NUEVO ESTADO
  const [loading, setLoading] = useState(true);

  // --- CAMBIO: useEffect ahora carga 5 cosas ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriasPromise = axios.get("http://127.0.0.1:8000/api/categorias/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const marcasPromise = axios.get("http://127.0.0.1:8000/api/marcas/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const descuentosPromise = axios.get("http://127.0.0.1:8000/api/descuentos/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // --- NUEVA LLAMADA ---
        const garantiasPromise = axios.get("http://127.0.0.1:8000/api/garantias/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const productoPromise = axios.get(`http://127.0.0.1:8000/api/productos/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const [catRes, marRes, descRes, garRes, prodRes] = await Promise.all([ // <-- 'garRes' añadido
          categoriasPromise,
          marcasPromise,
          descuentosPromise,
          garantiasPromise, // <-- NUEVA PROMESA
          productoPromise,
        ]);

        setCategorias(catRes.data);
        setMarcas(marRes.data);
        setDescuentos(descRes.data);
        setGarantias(garRes.data); // <-- NUEVO SETTER

        // --- CAMBIO: Añadido 'garantia' al setFormData ---
        setFormData({
          nombre: prodRes.data.nombre || "",
          precio: prodRes.data.precio || "",
          descripcion: prodRes.data.descripcion || "",
          imagen: prodRes.data.imagen || "",
          categoria: prodRes.data.categoria || "",
          marca: prodRes.data.marca || "",
          descuento: prodRes.data.descuento || "",
          garantia: prodRes.data.garantia || "", // <-- NUEVO
        });

      } catch (err) {
        console.error("Error al cargar datos:", err);
        toast.error("No se pudieron cargar los datos del producto ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]); 

  // handleChange (sin cambios)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // --- CAMBIO: handleSubmit ahora envía 'garantia' ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Datos para actualizar el producto (AHORA INCLUYE GARANTIA)
    const productoData = {
      nombre: formData.nombre,
      precio: formData.precio,
      descripcion: formData.descripcion,
      imagen: formData.imagen,
      categoria: formData.categoria,
      marca: formData.marca,
      garantia: formData.garantia === "" ? null : parseInt(formData.garantia), // <-- NUEVO
    };

    // 2. Datos para asignar el descuento (separado)
    const descuentoData = {
      descuento_id: formData.descuento === "" ? null : parseInt(formData.descuento),
    };

    try {
      // --- LLAMADA 1: Actualizar el producto (con garantía) ---
      await axios.put(
        `http://127.0.0.1:8000/api/productos/actualizar/${id}/`,
        productoData, // <-- Este objeto ahora lleva el ID de la garantía
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // --- LLAMADA 2: Asignar el descuento (sin cambios) ---
      await axios.put( 
        `http://127.0.0.1:8000/api/descuentos/asignar-descuento/${id}/`,
        descuentoData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Producto actualizado correctamente ✅");
      navigate("/admin/productos");

    } catch (err) {
      console.error("Error al actualizar producto:", err);
      if (err.response && err.response.data) {
        toast.error(`Error: ${JSON.stringify(err.response.data)} ❌`);
      } else {
        toast.error("Error al actualizar ❌");
      }
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando...</p>;
  }

  // --- RETURN (Añadido el <select> de Garantía) ---
  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Editar Producto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* ... (campos de nombre, precio, desc, imagen, categoria, marca sin cambios) ... */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Imagen (URL)</label>
          <input
            type="url"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm bg-white"
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Marca</label>
          <select
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm bg-white"
            required
          >
            <option value="">Seleccione una marca</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* --- CAMPO DE DESCUENTO (sin cambios) --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Descuento</label>
          <select
            name="descuento" 
            value={formData.descuento} 
            onChange={handleChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm bg-white"
          >
            <option value="">Sin Descuento</option> 
            {descuentos.map((desc) => (
              <option key={desc.id} value={desc.id}>
                {desc.nombre} ({desc.porcentaje}%)
              </option>
            ))}
          </select>
        </div>

        {/* --- NUEVO CAMPO DE GARANTÍA --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Garantía</label>
          <select
            name="garantia" 
            value={formData.garantia} 
            onChange={handleChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm bg-white"
          >
            <option value="">Sin Garantía</option> 
            {garantias.map((gar) => (
              <option key={gar.id} value={gar.id}>
                {gar.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};