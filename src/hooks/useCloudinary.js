import { useState } from 'react';

/**
 * Hook personalizado para manejar uploads a Cloudinary
 * @returns {Object} { imageUrl, loading, error, uploadImage, clearImage }
 */
export const useCloudinary = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dkmbshoqf";
  const upload_preset = import.meta.env.VITE_CLOUDINARY_PRESET || "Fronds";

  const uploadImage = async (file) => {
    if (!file) {
      setError('Por favor selecciona un archivo');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', upload_preset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      setImageUrl(data.secure_url);
      setLoading(false);
      return data.secure_url;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  const clearImage = () => {
    setImageUrl('');
    setError(null);
  };

  return {
    imageUrl,
    loading,
    error,
    uploadImage,
    clearImage,
  };
};
