import React, { useRef, useState, useEffect } from 'react';

const CameraCapture = ({ onCapture, onClose, isOpen }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' for front camera, 'environment' for back camera

  // Start camera when component opens
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError(err.message || 'Failed to access camera');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        // Create File object from blob
        const file = new File([blob], `camera-photo-${Date.now()}.png`, {
          type: 'image/png',
          lastModified: Date.now()
        });

        onCapture(file);
        onClose();
      }
    }, 'image/png', 0.9);
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative w-full h-full max-w-4xl max-h-screen bg-black rounded-lg overflow-hidden">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <h3 className="text-lg font-semibold">📸 Take Photo</h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-2xl font-bold"
              aria-label="Close camera"
            >
              ×
            </button>
          </div>
        </div>

        {/* Camera View */}
        <div className="relative w-full h-full flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Starting camera...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
              <div className="text-white text-center p-6">
                <div className="text-4xl mb-4">📷</div>
                <h3 className="text-xl font-semibold mb-2">Camera Error</h3>
                <p className="text-gray-300 mb-4">{error}</p>
                <div className="space-y-2">
                  <button
                    onClick={startCamera}
                    className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={onClose}
                    className="block w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Video Element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
          />

          {/* Canvas for capturing (hidden) */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="flex items-center justify-center space-x-8">
            
            {/* Switch Camera Button */}
            <button
              onClick={switchCamera}
              className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
              aria-label="Switch camera"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            {/* Capture Button */}
            <button
              onClick={capturePhoto}
              disabled={!stream || isLoading || error}
              className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label="Take photo"
            >
              <div className="w-12 h-12 bg-white rounded-full shadow-inner"></div>
            </button>

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
              aria-label="Cancel"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Instructions */}
          <div className="text-center mt-4">
            <p className="text-white/80 text-sm">
              Position your face in the center and tap the capture button
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
