import React, { useState, useRef } from 'react';

const TryNow = () => {
  // State management
  const [selectedStyle, setSelectedStyle] = useState('messy fringe');
  const [selectedColor, setSelectedColor] = useState('#2F1B14');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [imageFile, setImageFile] = useState(null);
  
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview({
          src: e.target.result,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
        });
      };
      reader.readAsDataURL(file);
    }
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
    if (!selectedStyle) {
      setStatus({ message: "❌ Please select a hairstyle first!", type: 'error' });
      return;
    }

    setIsProcessing(true);
    setStatus({ message: `🚀 Generating ${selectedStyle}...`, type: '' });
    setResultImage(null);

    try {
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

      setResultImage(imageUrl);
      setStatus({ message: "✅ Transformation Complete!", type: 'success' });

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Transform your look instantly with our free AI hairstyle changer
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Upload your photo and try different hairstyles and colors instantly
        </p>

        {/* Instructions */}
        <div className="bg-gray-50 border-l-4 border-indigo-500 p-4 mb-6 rounded-lg">
          <div className="font-bold text-gray-800 mb-2">📋 How to use:</div>
          <div className="text-gray-600 text-sm leading-relaxed">
            1. <strong>Select a hairstyle</strong> from the gallery below<br />
            2. <strong>Upload your photo</strong> using the upload area<br />
            3. <strong>Click "Transform Hair"</strong> to see the magic happen!
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
        <div 
          className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-gray-50 mb-6 cursor-pointer hover:border-indigo-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {!imagePreview ? (
            <>
              <div className="text-4xl mb-4 opacity-60">📁</div>
              <div className="text-lg text-gray-700 mb-2">Drag & drop or click to upload</div>
              <div className="text-sm text-gray-500">Supports JPG, PNG, WebP</div>
            </>
          ) : (
            <div>
              <div className="text-lg text-green-600 font-bold mb-4">Image uploaded successfully!</div>
              <img 
                src={imagePreview.src} 
                alt="Preview" 
                className="max-w-full max-h-48 mx-auto rounded-lg shadow-md mb-4"
              />
              <div className="text-sm text-gray-600">
                <span>{imagePreview.name}</span> - <span>{imagePreview.size}</span>
              </div>
            </div>
          )}
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
      </div>
    </div>
  );
};

export default TryNow;