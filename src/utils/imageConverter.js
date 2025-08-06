/**
 * Image format converter utility
 * Converts various image formats to PNG for OpenAI compatibility
 */

/**
 * Check if the image is already in PNG format
 * @param {File} file - The image file to check
 * @returns {boolean} - True if the file is PNG, false otherwise
 */
export const isPngFormat = (file) => {
    return file.type === 'image/png';
  };
  
  /**
   * Get supported image formats
   * @returns {Array} - Array of supported MIME types
   */
  export const getSupportedFormats = () => {
    return [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/bmp',
      'image/gif',
      'image/tiff'
    ];
  };
  
  /**
   * Check if the image format is supported for conversion
   * @param {File} file - The image file to check
   * @returns {boolean} - True if supported, false otherwise
   */
  export const isSupportedFormat = (file) => {
    return getSupportedFormats().includes(file.type);
  };
  
  /**
   * Convert image to PNG format using canvas
   * @param {File} file - The image file to convert
   * @param {number} quality - Compression quality (0.1 to 1.0, default: 0.9)
   * @returns {Promise<File>} - Promise that resolves to PNG file
   */
  export const convertToPng = (file, quality = 0.9) => {
    return new Promise((resolve, reject) => {
      // Check if file is supported
      if (!isSupportedFormat(file)) {
        reject(new Error(`Unsupported file format: ${file.type}`));
        return;
      }
  
      // If already PNG, return as-is
      if (isPngFormat(file)) {
        resolve(file);
        return;
      }
  
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new Image();
        
        img.onload = () => {
          try {
            // Create canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions to match image
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw image on canvas
            ctx.drawImage(img, 0, 0);
            
            // Convert to PNG blob
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error('Failed to convert image to PNG'));
                return;
              }
              
              // Create new File object with PNG format
              const originalName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
              const pngFile = new File([blob], `${originalName}.png`, {
                type: 'image/png',
                lastModified: Date.now()
              });
              
              resolve(pngFile);
            }, 'image/png', quality);
            
          } catch (error) {
            reject(new Error(`Canvas conversion failed: ${error.message}`));
          }
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image for conversion'));
        };
        
        // Load image
        img.src = event.target.result;
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      // Read file as data URL
      reader.readAsDataURL(file);
    });
  };
  
  /**
   * Get file format information
   * @param {File} file - The image file
   * @returns {Object} - File format information
   */
  export const getFileInfo = (file) => {
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeFormatted: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      isPng: isPngFormat(file),
      isSupported: isSupportedFormat(file),
      extension: file.name.split('.').pop()?.toLowerCase() || 'unknown'
    };
  };
  
  /**
   * Validate and convert image if needed
   * @param {File} file - The image file to process
   * @param {Function} onProgress - Progress callback (optional)
   * @returns {Promise<Object>} - Promise with conversion result
   */
  export const processImageFile = async (file, onProgress = null) => {
    try {
      const fileInfo = getFileInfo(file);
      
      // Check if file is supported
      if (!fileInfo.isSupported) {
        throw new Error(`Unsupported file format: ${fileInfo.type}. Supported formats: ${getSupportedFormats().join(', ')}`);
      }
      
      // Progress callback
      if (onProgress) onProgress({ stage: 'validating', progress: 10 });
      
      let processedFile = file;
      let wasConverted = false;
      
      // Convert to PNG if needed
      if (!fileInfo.isPng) {
        if (onProgress) onProgress({ stage: 'converting', progress: 50 });
        
        processedFile = await convertToPng(file);
        wasConverted = true;
        
        if (onProgress) onProgress({ stage: 'completed', progress: 100 });
      } else {
        if (onProgress) onProgress({ stage: 'completed', progress: 100 });
      }
      
      return {
        success: true,
        originalFile: file,
        processedFile: processedFile,
        wasConverted: wasConverted,
        originalInfo: fileInfo,
        processedInfo: getFileInfo(processedFile)
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        originalFile: file,
        originalInfo: getFileInfo(file)
      };
    }
  };