import { supabase } from '../lib/supabase.js';
import {
  generateImageHash,
  generateUniqueHash,
  normalizeStyleName,
  normalizeColorCode
} from '../utils/imageHash.js';

/**
 * Convert displayed image element to blob using canvas
 * @param {HTMLImageElement} imgElement - The displayed image element
 * @returns {Promise<Blob|null>} - Image blob or null if failed
 */
const convertDisplayedImageToBlob = async (imgElement) => {
  return new Promise((resolve) => {
    try {
      // Create canvas and draw the already-loaded image
      const canvas = document.createElement('canvas');
      canvas.width = imgElement.naturalWidth || imgElement.width;
      canvas.height = imgElement.naturalHeight || imgElement.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgElement, 0, 0);

      // Convert to blob
      canvas.toBlob((blob) => {
        console.log('✅ Converted displayed image to blob:', blob?.size, 'bytes');
        resolve(blob);
      }, 'image/png', 0.9);
    } catch (error) {
      console.error('❌ Canvas conversion failed:', error);
      resolve(null);
    }
  });
};

/**
 * Upload displayed image to Supabase Storage
 * @param {HTMLImageElement} imgElement - The displayed image element
 * @param {string} fileName - Unique filename for storage
 * @returns {Promise<string|null>} - Supabase Storage URL or null if failed
 */
const uploadDisplayedImageToStorage = async (imgElement, fileName) => {
  try {
    console.log('📥 Converting displayed image to blob');

    // Convert displayed image to blob
    const imageBlob = await convertDisplayedImageToBlob(imgElement);

    if (!imageBlob) {
      throw new Error('Failed to convert displayed image to blob');
    }

    console.log('📥 Image converted to blob:', imageBlob.size, 'bytes');

    // Upload to Supabase Storage
    console.log('📤 Uploading to Supabase Storage:', fileName);
    const { data, error } = await supabase.storage
      .from('generated-images')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        upsert: false
      });

    if (error) {
      console.error('❌ Supabase upload error:', error);
      throw error;
    }

    console.log('✅ Upload successful:', data);

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('generated-images')
      .getPublicUrl(fileName);

    console.log('🔗 Generated public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('❌ Error uploading to storage:', error);
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

    // Query Supabase for existing image with expiration check
    const { data, error } = await supabase
      .from('generated_images')
      .select('generated_image_url, url_expires_at, is_permanent')
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

    // Check if URL has expired (only for non-permanent URLs)
    if (!data.is_permanent && data.url_expires_at) {
      const expiresAt = new Date(data.url_expires_at);
      const now = new Date();

      if (now > expiresAt) {
        console.log('⏰ Cache entry expired, removing...');
        // Delete expired entry
        await supabase
          .from('generated_images')
          .delete()
          .eq('unique_hash', uniqueHash);
        return null;
      }
    }

    console.log('🔍 Cache hit! Found image:', data?.generated_image_url, data.is_permanent ? '(permanent)' : '(temporary)');
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

    // For now, just cache the OpenAI URL with expiration tracking
    // This provides immediate caching benefits while URLs are valid
    const expiresAt = new Date(Date.now() + 50 * 60 * 1000); // 50 minutes

    // Insert into Supabase with expiration info
    const { error } = await supabase
      .from('generated_images')
      .insert({
        unique_hash: uniqueHash,
        original_image_hash: imageHash,
        hairstyle: normalizedStyle,
        hair_color: normalizedColor,
        generated_image_url: generatedImageUrl,
        is_permanent: false, // OpenAI URLs are temporary
        url_expires_at: expiresAt.toISOString()
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

    console.log('💾 Image successfully cached (expires in 50 minutes)');
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

/**
 * Test storage bucket access and permissions
 * @returns {Promise<Object>} - Test results
 */
export const testStorageAccess = async () => {
  console.log('🧪 Testing storage access...');

  try {
    // Test 1: List bucket contents
    const { data: listData, error: listError } = await supabase.storage
      .from('generated-images')
      .list();

    if (listError) {
      console.error('❌ Cannot list bucket:', listError);
      return { success: false, error: 'Cannot access bucket', details: listError };
    }

    console.log('✅ Bucket access OK. Current files:', listData.length);

    // Test 2: Try uploading a test file
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    const testFileName = `test-${Date.now()}.txt`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('generated-images')
      .upload(testFileName, testBlob);

    if (uploadError) {
      console.error('❌ Cannot upload to bucket:', uploadError);
      return { success: false, error: 'Cannot upload to bucket', details: uploadError };
    }

    console.log('✅ Upload test successful');

    // Clean up test file
    await supabase.storage
      .from('generated-images')
      .remove([testFileName]);

    return {
      success: true,
      message: 'Storage access working correctly',
      fileCount: listData.length
    };

  } catch (error) {
    console.error('❌ Storage test failed:', error);
    return { success: false, error: error.message };
  }
};

// Make test function available globally
if (typeof window !== 'undefined') {
  window.testStorageAccess = testStorageAccess;
}
