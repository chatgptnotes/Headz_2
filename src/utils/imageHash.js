import CryptoJS from 'crypto-js';

/**
 * Generate a consistent hash from an image file
 * @param {File} imageFile - The image file to hash
 * @returns {Promise<string>} - SHA-256 hash of the image
 */
export const generateImageHash = async (imageFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target.result;
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        const hash = CryptoJS.SHA256(wordArray).toString();
        resolve(hash);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(imageFile);
  });
};

/**
 * Generate a unique hash for a specific combination of image, hairstyle, and color
 * @param {string} imageHash - Hash of the original image
 * @param {string} hairstyle - Selected hairstyle
 * @param {string} hairColor - Selected hair color (hex code)
 * @returns {string} - Unique hash for this combination
 */
export const generateUniqueHash = (imageHash, hairstyle, hairColor) => {
  const combinedString = `${imageHash}_${hairstyle}_${hairColor}`;
  return CryptoJS.SHA256(combinedString).toString();
};

/**
 * Normalize hairstyle name for consistent hashing
 * @param {string} styleName - The hairstyle name
 * @returns {string} - Normalized style name
 */
export const normalizeStyleName = (styleName) => {
  return styleName.toLowerCase().trim().replace(/\s+/g, '_');
};

/**
 * Normalize color code for consistent hashing
 * @param {string} colorCode - The hex color code
 * @returns {string} - Normalized color code
 */
export const normalizeColorCode = (colorCode) => {
  return colorCode.toLowerCase().replace('#', '');
};
