import React from 'react';
import { FaImage, FaTimes } from 'react-icons/fa';
import { useCloudinary } from '../hooks/useCloudinary';

/**
 * Componente reutilizable para subir imágenes a Cloudinary
 * @param {Object} props - Props del componente
 * @param {string} props.value - URL de la imagen actual
 * @param {function} props.onChange - Callback cuando cambia la imagen
 * @param {string} props.label - Etiqueta del campo
 * @param {boolean} props.required - Si es requerido
 */
export const ImageUploader = ({ value, onChange, label = "Imagen", required = false }) => {
  const { imageUrl, loading, error, uploadImage, clearImage } = useCloudinary();

  React.useEffect(() => {
    if (imageUrl) {
      onChange(imageUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const handleClear = () => {
    clearImage();
    onChange('');
  };

  const currentImage = value || imageUrl;

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex gap-4 flex-wrap">
        {/* Preview de imagen */}
        {currentImage && (
          <div className="relative group">
            <img
              src={currentImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 shadow-md hover:shadow-lg transition"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition transform hover:scale-110"
            >
              <FaTimes size={16} />
            </button>
          </div>
        )}

        {/* Upload area */}
        <label className="flex-1 min-w-64 flex items-center justify-center border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition bg-blue-50">
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <FaImage className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-sm font-medium text-gray-700">
              {loading ? "Subiendo imagen..." : "Haz clic para subir"}
            </p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (Max 5MB)</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
          />
        </label>

        {/* Estados de carga y error */}
        {loading && (
          <div className="w-32 h-32 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-xs text-gray-600">Cargando...</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};
