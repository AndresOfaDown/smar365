import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
//import { CrearProductoForm } from "./CrearProductoForm";

export const CrearProductoForm = () => {  
 // const [producto, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");  // URL de la imagen
  const [categoria, setCategoria] = useState("");
  const [marca, setMarca] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access");

  // Cargar categorías y marcas al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriasRes = await axios.get("http://127.0.0.1:8000/api/categorias/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategorias(categoriasRes.data);

        const marcasRes = await axios.get("http://127.0.0.1:8000/api/marcas/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMarcas(marcasRes.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        toast.error("No se pudieron cargar las categorías o marcas ❌");
      }
    };
    fetchData();
  }, [token]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Datos del formulario
    const productoData = {
      nombre,
      precio,
      descripcion,
      imagen: imagenUrl,  // Enviar URL de la imagen
      categoria,
      marca,
    };

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/productos/crear/", productoData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",  // Enviamos los datos como JSON
        },
      });
      toast.success("Producto creado correctamente ✅");
      //setProductos((prevProductos) => [...prevProductos, res.data]);  // Actualiza la lista de productos
    } catch (err) {
      console.error("Error al crear producto:", err);
      toast.error("Error al crear el producto ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h3 className="text-lg font-semibold mb-3">Crear nuevo producto</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Precio</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Imagen (URL)</label>
          <input
            type="url"
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Categoría</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
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

        <div className="mb-4">
          <label className="block text-gray-700">Marca</label>
          <select
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
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

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          disabled={loading}
        >
          {loading ? "Cargando..." : <><FaPlus /> Crear</>}
        </button>
      </form>
    </div>
  );
};
