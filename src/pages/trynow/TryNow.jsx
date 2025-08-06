import React, { useState, useRef } from 'react';
import { getCachedImage, cacheGeneratedImage } from '../../services/imageCache.js';
import { processImageFile, getFileInfo } from '../../utils/imageConverter.js';
import CameraCapture from '../../components/CameraCapture.jsx';
import Navbar from '../../components/common_components/navbar/Navbar.jsx';
import Header from '../home/components/Header.jsx';

// Import test function for development
if (import.meta.env.DEV) {
  import('../../utils/testSupabase.js');
}

const TryNow = () => {
  // State management
  const [selectedStyle, setSelectedStyle] = useState('messy fringe');
  const [selectedColor, setSelectedColor] = useState('#2F1B14');
  const [imagePreview, setImagePreview] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const fileInputRef = useRef(null);

  // Configuration - Replace with your actual API key
  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  const HAIR_STYLE_PROMPTS = {
    'Textured Messy Quiff': 
      'PRESERVE EXACTLY: face shape, features, skin tone, lighting, background. ' +
      'ADD ONLY: Precise textured messy quiff hairstyle with these exact measurements: ' +
      '2.5 inch height on top, styled upward at exactly 15 degrees, ' +
      '6mm low fade sides with perfect gradient, ' +
      'matte finish with defined strands, zero shine, ' +
      'perfectly consistent volume throughout, ' +
      'natural hairline with uniform growth direction. ' +
      'NO variations in style, NO random elements, NO artistic interpretation. ' +
      'Mathematical precision in every measurement.',

    'Slick Back': 
      'PRESERVE EXACTLY: face shape, features, skin tone, lighting, background. ' +
      'ADD ONLY: Classic slick back with these exact measurements: ' +
      '3 inch length on top, combed back at exactly 180 degrees, ' +
      '9mm tapered sides with precise fade gradient, ' +
      'medium shine with perfectly straight comb lines, ' +
      'zero waves or variations, ' +
      'geometrically precise neckline. ' +
      'NO variations in style, NO random elements, NO artistic interpretation. ' +
      'Mathematical precision in every measurement.',

    'Messy Fringe': 
      'PRESERVE EXACTLY: face shape, features, skin tone, lighting, background. ' +
      'ADD ONLY: Modern messy fringe with these exact measurements: ' +
      '2 inch length, swept forward at exactly 45 degrees, ' +
      '6mm tapered sides with soft gradient blend, ' +
      'natural matte finish with precise piece-y texture, ' +
      'fringe covering exactly 30% of forehead with geometric asymmetric sweep, ' +
      'uniform choppy layer pattern. ' +
      'NO variations in style, NO random elements, NO artistic interpretation. ' +
      'Mathematical precision in every measurement.'
  };

  const hairstyles = [
    { name: 'messy fringe', image: 'images/image1.png', alt: 'Messy Fringe' },
    { name: 'slick back', image: 'images/image2.png', alt: 'Slick Back' },
    { name: 'Textured Messy Quiff', image: 'images/image3.png', alt: 'Textured Messy Quiff' }
  ];

  const colors = [
    '#2F1B14', // Dark Brown
    '#8B4513', // Saddle Brown
    '#FFD700', // Gold
    '#8B0000', // Dark Red
    '#1E90FF'  // Dodger Blue
  ];

  const selectHairstyle = (styleName) => {
    setSelectedStyle(styleName);
  };

  const selectColor = (color) => {
    setSelectedColor(color);
  };

  const handleCameraCapture = async (capturedFile) => {
    // Process the captured photo the same way as uploaded files
    await processFile(capturedFile);
  };

  const processFile = async (file) => {
    // Reset states
    setResultImage(null);
    setIsFromCache(false);
    setIsConverting(true);
    setConversionProgress(0);

    try {
      // Get initial file info
      const fileInfo = getFileInfo(file);

      // Show initial status
      if (fileInfo.isPng) {
        setStatus({ message: `✅ PNG format detected - ready to upload!`, type: 'success' });
      } else {
        setStatus({ message: `🔄 Converting ${fileInfo.extension.toUpperCase()} to PNG...`, type: '' });
      }

      // Process the image (convert if needed)
      const result = await processImageFile(file, (progress) => {
        setConversionProgress(progress.progress);

        switch (progress.stage) {
          case 'validating':
            setStatus({ message: '🔍 Validating image format...', type: '' });
            break;
          case 'converting':
            setStatus({ message: `🔄 Converting to PNG... ${progress.progress}%`, type: '' });
            break;
          case 'completed':
            setStatus({ message: '✅ Image ready for processing!', type: 'success' });
            break;
        }
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Set the processed file (PNG format)
      setImageFile(result.processedFile);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview({
          src: e.target.result,
          name: result.processedFile.name,
          size: result.processedInfo.sizeFormatted,
          originalFormat: result.originalInfo.extension.toUpperCase(),
          wasConverted: result.wasConverted,
          isFromCamera: file.name.includes('camera-photo')
        });
      };
      reader.readAsDataURL(result.processedFile);

      // Show conversion success message
      if (result.wasConverted) {
        setStatus({
          message: `✅ Successfully converted ${result.originalInfo.extension.toUpperCase()} to PNG!`,
          type: 'success'
        });
      } else {
        setStatus({
          message: file.name.includes('camera-photo') ? `📸 Camera photo ready!` : `✅ PNG image loaded successfully!`,
          type: 'success'
        });
      }

    } catch (error) {
      console.error('Image processing error:', error);
      setStatus({
        message: `❌ Error: ${error.message}`,
        type: 'error'
      });
      setImageFile(null);
      setImagePreview(null);
    } finally {
      setIsConverting(false);
      setConversionProgress(0);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    await processFile(file);
  };

  const createForeheadMask = (imageFile) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');

          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = 'white';
          
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(canvas.width, 0);
          ctx.lineTo(canvas.width, canvas.height * 0.6);
          ctx.bezierCurveTo(
            canvas.width * 0.8, canvas.height * 0.3,
            canvas.width * 0.2, canvas.height * 0.3,
            0, canvas.height * 0.6
          );
          ctx.closePath();
          ctx.fill();

          canvas.toBlob((blob) => {
            resolve(new File([blob], 'mask.png', { type: 'image/png' }));
          }, 'image/png');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(imageFile);
    });
  };

  const editImage = async () => {
    if (!API_KEY || API_KEY.length < 20) {
      setStatus({ message: "Error: Please set your OpenAI API Key in the script.", type: 'error' });
      return;
    }
    if (!imageFile) {
      setStatus({ message: "❌ Please upload your photo first!", type: 'error' });
      return;
    }

    // Verify PNG format (should always be PNG after conversion)
    if (imageFile.type !== 'image/png') {
      setStatus({ message: "❌ Image must be in PNG format for OpenAI processing!", type: 'error' });
      return;
    }
    if (!selectedStyle) {
      setStatus({ message: "❌ Please select a hairstyle first!", type: 'error' });
      return;
    }

    setIsProcessing(true);
    setResultImage(null);
    setIsFromCache(false);

    try {
      // First, check if we have a cached version
      setStatus({ message: "� Checking cache...", type: '' });
      console.log('🔍 Checking cache for:', {
        fileName: imageFile.name,
        style: selectedStyle,
        color: selectedColor
      });

      const cachedImageUrl = await getCachedImage(imageFile, selectedStyle, selectedColor);
      console.log('🔍 Cache result:', cachedImageUrl ? 'FOUND' : 'NOT FOUND');

      if (cachedImageUrl) {
        // Found in cache!
        console.log('⚡ Using cached image:', cachedImageUrl);
        setResultImage(cachedImageUrl);
        setIsFromCache(true);
        setStatus({ message: "⚡ Retrieved from cache!", type: 'success' });
        return;
      }

      // Not in cache, generate new image
      setStatus({ message: `🚀 Generating ${selectedStyle}...`, type: '' });

      const maskFile = await createForeheadMask(imageFile);
      const finalPrompt = HAIR_STYLE_PROMPTS[selectedStyle];

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("mask", maskFile);
      formData.append("prompt", finalPrompt);
      formData.append("model", "dall-e-2");
      formData.append("n", "1");
      formData.append("size", "1024x1024");
      formData.append("response_format", "url");

      const response = await fetch(import.meta.env.VITE_OPENAI_API_URL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}` },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message);
      }

      const data = await response.json();
      const imageUrl = data.data[0].url;

      // Set the result image first
      setResultImage(imageUrl);
      setIsFromCache(false);
      setStatus({ message: "✅ Transformation Complete!", type: 'success' });

      // Cache the newly generated image (in background)
      setTimeout(async () => {
        setStatus({ message: "💾 Saving to cache...", type: '' });
        console.log('💾 Caching new image:', {
          fileName: imageFile.name,
          style: selectedStyle,
          color: selectedColor,
          imageUrl: imageUrl
        });

        const cacheSuccess = await cacheGeneratedImage(
          imageFile,
          selectedStyle,
          selectedColor,
          imageUrl
        );
        console.log('💾 Cache save result:', cacheSuccess ? 'SUCCESS' : 'FAILED');

        if (cacheSuccess) {
          setStatus({ message: "✅ Image cached for 50 minutes!", type: 'success' });
        } else {
          setStatus({ message: "⚠️ Caching failed, but image is ready!", type: 'success' });
        }
      }, 1000); // Wait 1 second

    } catch (error) {
      setStatus({ message: `Error: ${error.message}`, type: 'error' });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = 'hairstyle-result.png';
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <Header />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-auto p-6 md:p-8">
        {/* Page Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            AI Hair Transformation Studio
          </h1>
          <p className="text-gray-600">
            Choose your style, upload your photo, and see the magic happen!
          </p>
        </div>

        {/* Quick Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-4 mb-6 rounded-lg">
          <div className="text-center text-sm text-gray-700">
            <span className="font-semibold">Quick Start:</span> Choose style → Upload/Take photo → Transform! ✨
          </div>
        </div>

        {/* Selected Style Display */}
        {selectedStyle && (
          <div className="mb-6 p-5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white text-center shadow-lg">
            <div className="text-xl font-bold mb-2">✨ Selected Hairstyle</div>
            <div className="text-lg opacity-95 uppercase tracking-wide">{selectedStyle}</div>
          </div>
        )}

        {/* Hairstyle Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {hairstyles.map((style, index) => (
            <div
              key={index}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedStyle === style.name 
                  ? 'ring-4 ring-green-500 ring-opacity-50' 
                  : ''
              }`}
              onClick={() => selectHairstyle(style.name)}
            >
              <div className="h-48 bg-gray-200 rounded-xl overflow-hidden shadow-md">
                <img 
                  src={style.image} 
                  alt={style.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Color Palette */}
        <div className="flex justify-center gap-3 mb-6">
          {colors.map((color, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-200 hover:scale-125 ${
                selectedColor === color 
                  ? 'ring-4 ring-green-500 ring-offset-2' 
                  : 'shadow-lg'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => selectColor(color)}
            />
          ))}
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Upload Your Photo</h3>

          {!imagePreview ? (
            <div className="space-y-4">
              {/* Upload Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* File Upload */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-3xl mb-3 opacity-60">📁</div>
                  <div className="text-lg text-gray-700 mb-2">Upload from Device</div>
                  <div className="text-sm text-gray-500">JPG, PNG, WebP, BMP, GIF, TIFF</div>
                  <div className="text-xs text-blue-600 mt-2">
                    ✨ Auto-converts to PNG
                  </div>
                </div>

                {/* Camera Capture */}
                <div
                  className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer bg-green-50"
                  onClick={() => setIsCameraOpen(true)}
                >
                  <div className="text-3xl mb-3 opacity-60">�</div>
                  <div className="text-lg text-gray-700 mb-2">Take Photo</div>
                  <div className="text-sm text-gray-500">Use your camera</div>
                  <div className="text-xs text-green-600 mt-2">
                    📱 Instant capture
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center text-sm text-gray-500 mt-4">
                Choose an option above to get started with your hair transformation
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-lg text-green-600 font-bold mb-4">
                {imagePreview.isFromCamera ? '📸 Camera photo ready!' :
                 imagePreview.wasConverted ? '🔄 Image converted & ready!' :
                 '✅ Image uploaded successfully!'}
              </div>

              <div className="relative inline-block">
                <img
                  src={imagePreview.src}
                  alt="Preview"
                  className="max-w-full max-h-48 mx-auto rounded-lg shadow-md mb-4"
                />

                {/* Remove Image Button */}
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                    setResultImage(null);
                    setIsFromCache(false);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  <span className="font-medium">{imagePreview.name}</span> - <span>{imagePreview.size}</span>
                </div>
                {imagePreview.wasConverted && (
                  <div className="text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded inline-block">
                    ✓ Converted from {imagePreview.originalFormat} to PNG
                  </div>
                )}
                {imagePreview.isFromCamera && (
                  <div className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded inline-block">
                    📸 Captured from camera
                  </div>
                )}
                <div className="text-xs text-green-600">
                  🎯 Ready for OpenAI processing
                </div>
              </div>

              {/* Change Photo Button */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                    setResultImage(null);
                    setIsFromCache(false);
                  }}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  📷 Change Photo
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/bmp,image/gif,image/tiff"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Transform Button */}
        <div className="text-center mb-6">
          <button
            onClick={editImage}
            disabled={isProcessing}
            className={`px-8 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
              isProcessing
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isProcessing ? 'Processing...' : '✨ Transform Hair'}
          </button>
        </div>

        {/* Status Message */}
        {status.message && (
          <div className={`text-center p-3 rounded-lg font-medium mb-6 ${
            status.type === 'error'
              ? 'text-red-600 bg-red-50'
              : status.type === 'success'
              ? 'text-green-600 bg-green-50 font-bold'
              : 'text-blue-600 bg-blue-50'
          }`}>
            {status.message}
          </div>
        )}

        {/* Conversion Progress */}
        {isConverting && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">Converting Image</span>
                <span className="text-sm text-blue-600">{conversionProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${conversionProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Converting your image to PNG format for OpenAI compatibility...
              </p>
            </div>
          </div>
        )}

        {/* Cache Status Indicator */}
        {resultImage && (
          <div className={`text-center p-2 rounded-lg text-sm mb-4 ${
            isFromCache
              ? 'text-green-700 bg-green-100 border border-green-200'
              : 'text-blue-700 bg-blue-100 border border-blue-200'
          }`}>
            {isFromCache
              ? '⚡ This image was retrieved from cache (instant result!)'
              : '🎨 This image was freshly generated for you'
            }
          </div>
        )}

        {/* Result Image */}
        {resultImage && (
          <div className="flex flex-col items-center">
            <div className="relative">
              <img 
                src={resultImage} 
                alt="Transformed Hair"
                className="w-80 h-80 object-cover rounded-2xl border-4 border-indigo-500 shadow-2xl transition-transform duration-300 hover:scale-105"
              />
            </div>
            <button
              onClick={downloadImage}
              className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transition-all duration-300"
            >
              💾 Download
            </button>
          </div>
        )}

        {/* Camera Capture Modal */}
        <CameraCapture
          isOpen={isCameraOpen}
          onCapture={handleCameraCapture}
          onClose={() => setIsCameraOpen(false)}
        />
        </div>
      </div>
    </div>
  );
};

export default TryNow;