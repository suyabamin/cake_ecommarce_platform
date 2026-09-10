import { compressImage } from './imageCompressor';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Uploads an image file to Cloudinary or returns optimized compressed data URL as fallback.
 * @param {File} file 
 * @returns {Promise<string>} Image URL
 */
export async function uploadImage(file) {
  if (!file) return null;

  try {
    // 1. Compress image first
    const compressedFile = await compressImage(file, 1200, 0.82);

    // 2. If Cloudinary config exists, upload directly to Cloudinary
    if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET) {
      const formData = new FormData();
      formData.append('file', compressedFile);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const data = await res.json();
      return data.secure_url;
    }

    // 3. Fallback: Convert to optimized Data URL if Cloudinary is not configured yet
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(compressedFile);
    });
  } catch (err) {
    console.error('Image upload error:', err);
    throw err;
  }
}
