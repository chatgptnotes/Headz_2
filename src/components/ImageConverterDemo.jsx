import React, { useState } from 'react';
import { processImageFile, getSupportedFormats } from '../utils/imageConverter.js';

const ImageConverterDemo = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setResult(null);
    setIsProcessing(true);
    setProgress(0);

    try {
      const conversionResult = await processImageFile(file, (progressInfo) => {
        setProgress(progressInfo.progress);
      });

      setResult(conversionResult);
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPng = () => {
    if (result?.processedFile) {
      const url = URL.createObjectURL(result.processedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.processedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Image Format Converter Demo</h2>
      
      {/* Supported Formats */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Supported Formats:</h3>
        <div className="flex flex-wrap gap-2">
          {getSupportedFormats().map(format => (
            <span key={format} className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-sm">
              {format.split('/')[1].toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* File Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select an image to convert to PNG:
        </label>
        <input
          type="file"
          accept={getSupportedFormats().join(',')}
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
      </div>

      {/* Processing Progress */}
      {isProcessing && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Converting...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {result.success ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3">✅ Conversion Successful!</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original File Info */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Original File:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Name: {result.originalInfo.name}</div>
                    <div>Format: {result.originalInfo.extension.toUpperCase()}</div>
                    <div>Size: {result.originalInfo.sizeFormatted}</div>
                  </div>
                </div>

                {/* Processed File Info */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Converted File:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Name: {result.processedInfo.name}</div>
                    <div>Format: PNG</div>
                    <div>Size: {result.processedInfo.sizeFormatted}</div>
                  </div>
                </div>
              </div>

              {result.wasConverted && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-700">
                    🔄 Image was converted from {result.originalInfo.extension.toUpperCase()} to PNG format
                  </p>
                </div>
              )}

              <button
                onClick={downloadPng}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                📥 Download PNG
              </button>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">❌ Conversion Failed</h3>
              <p className="text-sm text-red-600">{result.error}</p>
            </div>
          )}
        </div>
      )}

      {/* Usage Instructions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">How it works:</h3>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>Select any supported image format</li>
          <li>The converter automatically detects the format</li>
          <li>If not PNG, it converts the image using HTML5 Canvas</li>
          <li>Download the converted PNG file</li>
          <li>Use the PNG file with OpenAI APIs</li>
        </ol>
      </div>
    </div>
  );
};

export default ImageConverterDemo;
