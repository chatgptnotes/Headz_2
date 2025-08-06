import { supabase } from '../lib/supabase.js';
import {
  generateImageHash,
  generateUniqueHash,
  normalizeStyleName,
  normalizeColorCode
} from '../utils/imageHash.js';

/**
 * Download image from URL and upload to Supabase Storage
 * @param {string} imageUrl - OpenAI image URL
 * @param {string} fileName - Unique filename for storage
 * @returns {Promise<string|null>} - Supabase Storage URL or null if failed
 */
const uploadImageToStorage = async (imageUrl, fileName) => {
  try {
    // Download the image from OpenAI
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to download image');

    const imageBlob = await response.blob();

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('generated-images')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        upsert: false
      });

    if (error) throw error;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('generated-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading to storage:', error);
    return null;
  }
};

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

    console.log('🔍 Cache lookup details:', {
      imageHash: imageHash.substring(0, 8) + '...',
      normalizedStyle,
      normalizedColor,
      uniqueHash: uniqueHash.substring(0, 8) + '...'
    });

    // Query Supabase for existing image
    const { data, error } = await supabase
      .from('generated_images')
      .select('generated_image_url')
      .eq('unique_hash', uniqueHash)
      .single();

    if (error) {
      console.log('🔍 Cache query error:', error.code, error.message);
      if (error.code === 'PGRST116') {
        // No rows found - this is expected when image doesn't exist in cache
        return null;
      }
      throw error;
    }

    console.log('🔍 Cache hit! Found image:', data?.generated_image_url);
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

    console.log('💾 Caching image details:', {
      imageHash: imageHash.substring(0, 8) + '...',
      normalizedStyle,
      normalizedColor,
      uniqueHash: uniqueHash.substring(0, 8) + '...',
      imageUrl: generatedImageUrl
    });

    // Upload image to permanent storage
    const fileName = `${uniqueHash}.png`;
    const permanentUrl = await uploadImageToStorage(generatedImageUrl, fileName);

    if (!permanentUrl) {
      console.warn('Failed to upload to storage, using original URL');
      // Fallback to original URL if storage fails
    }

    const finalImageUrl = permanentUrl || generatedImageUrl;

    // Insert into Supabase
    const { error } = await supabase
      .from('generated_images')
      .insert({
        unique_hash: uniqueHash,
        original_image_hash: imageHash,
        hairstyle: normalizedStyle,
        hair_color: normalizedColor,
        generated_image_url: finalImageUrl
      });

    if (error) {
      console.log('💾 Cache insert error:', error.code, error.message);
      if (error.code === '23505') {
        // Unique constraint violation - image already exists
        console.log('Image already cached');
        return true;
      }
      throw error;
    }

    console.log('💾 Image successfully cached', permanentUrl ? '(permanent storage)' : '(temporary URL)');
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
