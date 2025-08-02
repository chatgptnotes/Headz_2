import React, { useState } from 'react';
import Navbar from '../../components/common_components/navbar/Navbar';

const TryNow = () => {
    const [imageFile, setImageFile] = useState(null);
    const [hairStyle, setHairStyle] = useState("natural, thick, healthy-looking hair");
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState("");
    const [statusType, setStatusType] = useState("");
    const [resultImage, setResultImage] = useState(null);

    // Hair style options
    const hairStyleOptions = [
        { value: "natural, thick, healthy-looking hair", label: "Natural Thick Healthy Hair" },
        { value: "natural curly hair", label: "Natural Curly Hair" },
        { value: "shoulder-length natural hair", label: "Shoulder-Length Natural Hair" },
        { value: "short, neatly styled natural hair", label: "Short Neatly Styled Hair" },
        { value: "natural wavy hair", label: "Natural Wavy Hair" },
        { value: "classic side part hair", label: "Classic Side Part Hair" },
        { value: "textured short hair", label: "Textured Short Hair" },
        { value: "modern fade haircut", label: "Modern Fade Haircut" },
        { value: "natural long hair", label: "Natural Long Hair" },
        { value: "professional short haircut", label: "Professional Short Haircut" }
    ];

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

                    // Fill entire canvas with black (areas that won't change)
                    ctx.fillStyle = 'black';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Create a more natural hair mask area
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.fillStyle = 'white';
                    ctx.beginPath();

                    // More precise hair area - only covers hair/scalp, not face
                    ctx.ellipse(
                        canvas.width / 2,      // Center X
                        canvas.height * 0.12,  // Center Y (higher up to avoid face)
                        canvas.width * 0.35,   // Radius X (narrower to avoid face)
                        canvas.height * 0.25,  // Radius Y (shorter to avoid face)
                        0, 0, 2 * Math.PI
                    );
                    ctx.fill();

                    // Add additional area for sides (temples)
                    ctx.beginPath();
                    ctx.ellipse(
                        canvas.width * 0.25,   // Left temple
                        canvas.height * 0.25,
                        canvas.width * 0.15,
                        canvas.height * 0.2,
                        0, 0, 2 * Math.PI
                    );
                    ctx.fill();

                    ctx.beginPath();
                    ctx.ellipse(
                        canvas.width * 0.75,   // Right temple
                        canvas.height * 0.25,
                        canvas.width * 0.15,
                        canvas.height * 0.2,
                        0, 0, 2 * Math.PI
                    );
                    ctx.fill();

                    // Convert canvas to PNG file
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
        // WARNING: Never put your OpenAI API Key directly in client-side code
        // This is for learning purposes only. Use a backend for real applications.
        const API_KEY = import.meta.env.VITE_OPENAI_API_KEY; // Add your OpenAI API KEY here

        if (!imageFile) {
            setStatus("Please select an image.");
            setStatusType('error');
            return;
        }

        if (!API_KEY || API_KEY.length < 20 || !API_KEY.startsWith('sk-')) {
            setStatus("Error: Please add your valid OpenAI API Key in the code.");
            setStatusType('error');
            return;
        }

        setIsProcessing(true);
        setResultImage(null);
        setStatus(`🚀 Generating ${hairStyle} transformation...`);
        setStatusType('');

        try {
            // Create automatic mask that covers forehead/scalp
            const maskFile = await createForeheadMask(imageFile);

            const formData = new FormData();
            formData.append("image", imageFile);
            formData.append("mask", maskFile);
            formData.append("prompt", `Keep the exact same face, expression, eyes, nose, mouth, skin tone, and all facial features unchanged. DO NOT change any facial expression or features. Only change the hair to ${hairStyle} with natural texture, lighting, and shadows that match the original photo. Blend seamlessly with the existing hairline. Maintain the same lighting conditions and background exactly as they are.`);
            formData.append("n", "1");
            formData.append("size", "1024x1024");

            const response = await fetch(import.meta.env.VITE_OPENAI_API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: formData
            });

            const data = await response.json();

            if (data?.data?.[0]?.url) {
                setResultImage(data.data[0].url);
                setStatus(`✅ ${hairStyle} transformation complete!`);
                setStatusType('success');
            } else {
                const errorMessage = data.error?.message || "Failed to edit image. Check console for details.";
                setStatus(`Error: ${errorMessage}`);
                setStatusType('error');
                console.error(data);
            }
        } catch (error) {
            setStatus(`An unexpected error occurred: ${error.message}`);
            setStatusType('error');
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadResult = () => {
        if (resultImage) {
            const link = document.createElement('a');
            link.href = resultImage;
            link.download = `hair_transformation_${Date.now()}.png`;
            link.click();
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setResultImage(null);
        setStatus("");
    };

    return (
        <>
        <Navbar />
            <div className="min-h-screen bg-gray-100 flex justify-center items-center p-5">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">AI Hair Editor</h1>

                    <div className="text-left">
                        <label className="block mt-4 mb-2 font-semibold text-gray-600">
                            Choose Image (PNG format):
                        </label>
                        <input
                            type="file"
                            accept="image/png"
                            onChange={handleImageChange}
                            className="w-full p-3 border border-gray-300 rounded-md text-base mb-5"
                        />

                        <label className="block mb-2 font-semibold text-gray-600">
                            Hair Style:
                        </label>
                        <select
                            value={hairStyle}
                            onChange={(e) => setHairStyle(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md text-base mb-4"
                        >
                            {hairStyleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={editImage}
                        disabled={isProcessing}
                        className={`w-full p-3 rounded-md border-none text-base font-bold cursor-pointer transition-colors duration-300 ${isProcessing
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            } text-white`}
                    >
                        {isProcessing ? 'Processing...' : '✨ Transform Hair'}
                    </button>

                    {status && (
                        <div className={`mt-4 font-medium ${statusType === 'error' ? 'text-red-500' :
                                statusType === 'success' ? 'text-green-600 font-semibold' :
                                    'text-gray-700'
                            }`}>
                            {status}
                        </div>
                    )}

                    {resultImage && (
                        <div className="mt-8">
                            <img
                                src={resultImage}
                                alt="Edited Image"
                                className="max-w-full rounded-lg border border-gray-300"
                            />
                            <button
                                onClick={downloadResult}
                                className="w-full mt-4 p-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-bold cursor-pointer transition-colors duration-300"
                            >
                                💾 Download Result
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TryNow;