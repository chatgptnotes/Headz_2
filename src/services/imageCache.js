import { supabase } from '../lib/supabase.js';
import { 
  generateImageHash, 
  generateUniqueHash, 
  normalizeStyleName, 
  normalizeColorCode 
} from '../utils/imageHash.js';

/**
 * Check if a generated image already exists in cache
 * @param {File} imageFile - The original image file
 * @param {string} hairstyle - Selected hairstyle
 * @param {string} hairColor - Selected hair color
 * @returns {Promise<string|null>} - URL of cached image or null if not found
 */
export const getCachedImage = async (imageFile, hairstyle, hairColor) => {
  try {
    // Generate hashes
    const imageHash = await generateImageHash(imageFile);
    const normalizedStyle = normalizeStyleName(hairstyle);
    const normalizedColor = normalizeColorCode(hairColor);
    const uniqueHash = generateUniqueHash(imageHash, normalizedStyle, normalizedColor);

    // Query Supabase for existing image
    const { data, error } = await supabase
      .from('generated_images')
      .select('generated_image_url')
      .eq('unique_hash', uniqueHash)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found - this is expected when image doesn't exist in cache
        return null;
      }
      throw error;
    }

    return data?.generated_image_url || null;
  } catch (error) {
    console.error('Error checking cached image:', error);
    return null; // Return null on error to allow fallback to generation
  }
};

/**
 * Store a newly generated image in cache
 * @param {File} imageFile - The original image file
 * @param {string} hairstyle - Selected hairstyle
 * @param {string} hairColor - Selected hair color
 * @param {string} generatedImageUrl - URL of the generated image
 * @returns {Promise<boolean>} - Success status
 */
export const cacheGeneratedImage = async (imageFile, hairstyle, hairColor, generatedImageUrl) => {
  try {
    // Generate hashes
    const imageHash = await generateImageHash(imageFile);
    const normalizedStyle = normalizeStyleName(hairstyle);
    const normalizedColor = normalizeColorCode(hairColor);
    const uniqueHash = generateUniqueHash(imageHash, normalizedStyle, normalizedColor);

    // Insert into Supabase
    const { error } = await supabase
      .from('generated_images')
      .insert({
        unique_hash: uniqueHash,
        original_image_hash: imageHash,
        hairstyle: normalizedStyle,
        hair_color: normalizedColor,
        generated_image_url: generatedImageUrl
      });

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation - image already exists
        console.log('Image already cached');
        return true;
      }
      throw error;
    }

    console.log('Image successfully cached');
    return true;
  } catch (error) {
    console.error('Error caching generated image:', error);
    return false; // Return false on error but don't break the flow
  }
};

/**
 * Get statistics about cached images
 * @returns {Promise<Object>} - Cache statistics
 */
export const getCacheStats = async () => {
  try {
    const { count, error } = await supabase
      .from('generated_images')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    return {
      totalCachedImages: count || 0,
      success: true
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return {
      totalCachedImages: 0,
      success: false,
      error: error.message
    };
  }
};
