import React, { useState } from 'react';
import { Upload, Download, Sliders, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import './App.css';

const App = () => {
  // State management
  const [image, setImage] = useState(null);
  const [cutoffFreq, setCutoffFreq] = useState(30);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);

  // API endpoints
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProcessing(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('cutoffFreq', cutoffFreq);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/process-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setResults(response.data);
        setImage(response.data.originalImage);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Generate sample image
  const generateSampleImage = async () => {
    setProcessing(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/generate-sample`);
      if (response.data.success) {
        setImage(response.data.image);
        // Process the generated image
        const blob = await fetch(response.data.image).then(r => r.blob());
        const file = new File([blob], 'sample.png', { type: 'image/png' });
        
        const formData = new FormData();
        formData.append('image', file);
        formData.append('cutoffFreq', cutoffFreq);

        const processResponse = await axios.post(`${API_BASE_URL}/api/process-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (processResponse.data.success) {
          setResults(processResponse.data);
        }
      }
    } catch (error) {
      console.error('Error generating sample:', error);
      alert('Error generating sample image. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle cutoff frequency change
  const handleCutoffChange = async (newCutoff) => {
    setCutoffFreq(newCutoff);
    
    if (!image) return;

    setProcessing(true);
    try {
      // Convert current image to file
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], 'current.png', { type: 'image/png' });

      const formData = new FormData();
      formData.append('image', file);
      formData.append('cutoffFreq', newCutoff);

      const processResponse = await axios.post(`${API_BASE_URL}/api/process-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (processResponse.data.success) {
        setResults(processResponse.data);
      }
    } catch (error) {
      console.error('Error updating filter:', error);
    } finally {
      setProcessing(false);
    }
  };

  // Download filtered image
  const downloadFiltered = () => {
    if (!results?.filteredImage) return;
    
    const link = document.createElement('a');
    link.download = 'filtered-image.png';
    link.href = results.filteredImage;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Fourier Transform Image Filter
          </h1>
          <p className="text-lg text-purple-300 mt-2">
            Visualizing Noise Reduction using a 2D Low-Pass Filter
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-1 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-600 pb-3">
              Controls
            </h2>
            
            <div className="space-y-6">
              {/* Image Input */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-purple-300 flex items-center gap-2">
                  <ImageIcon size={20}/> Image Source
                </h3>
                <label className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md cursor-pointer transition flex items-center justify-center gap-2 text-sm font-semibold">
                  <Upload size={18} />
                  Upload Image
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden"
                    disabled={processing}
                  />
                </label>
                <button
                  onClick={generateSampleImage}
                  disabled={processing}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-md transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Sample Image
                </button>
              </div>

              {/* Filter Settings */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-purple-300 flex items-center gap-2">
                  <Sliders size={20}/> Filter Settings
                </h3>
                <label className="text-white block text-sm">Low-Pass Cutoff Frequency</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range" 
                    min="1" 
                    max="150" 
                    value={cutoffFreq}
                    onChange={(e) => handleCutoffChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    disabled={!image || processing}
                  />
                  <span className="bg-gray-700 text-white text-sm font-mono rounded-md px-2 py-1 w-12 text-center">
                    {cutoffFreq}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Lower values remove more high-frequency noise but may cause blurring.
                </p>
              </div>

              {/* Export */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-purple-300 flex items-center gap-2">
                  <Download size={20}/> Export
                </h3>
                <button
                  onClick={downloadFiltered}
                  disabled={!results?.filteredImage || processing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  Download Filtered Image
                </button>
              </div>
            </div>
          </div>

          {/* Visualizations Column */}
          <div className="lg:col-span-2 relative">
            {processing && (
              <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-white">Processing...</span>
                </div>
              </div>
            )}
            
            {!image ? (
              <div className="h-full bg-gray-800/50 backdrop-blur-sm rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <p className="text-lg font-medium">Upload an image or generate a sample to begin.</p>
                  <p className="text-sm">The visualization panels will appear here.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VisualizationPanel 
                  title="Spatial Domain (Original)" 
                  imageSrc={results?.originalImage || image}
                  dimensions={results?.dimensions}
                />
                <VisualizationPanel 
                  title="Spatial Domain (Filtered)" 
                  imageSrc={results?.filteredImage}
                  dimensions={results?.dimensions}
                />
                <VisualizationPanel 
                  title="Frequency Domain (Original Spectrum)" 
                  imageSrc={results?.originalSpectrum}
                  dimensions={results?.dimensions}
                />
                <VisualizationPanel 
                  title="Frequency Domain (Filtered Spectrum)" 
                  imageSrc={results?.filteredSpectrum}
                  dimensions={results?.dimensions}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Visualization Panel Component
const VisualizationPanel = ({ title, imageSrc, dimensions }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 shadow-lg">
    <h3 className="text-md font-semibold text-white mb-3 text-center tracking-wide">
      {title}
    </h3>
    <div className="w-full aspect-square rounded bg-black border border-gray-700 overflow-hidden">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <span className="text-sm">No data</span>
        </div>
      )}
    </div>
    {dimensions && (
      <p className="text-xs text-gray-400 text-center mt-2">
        {dimensions.width} × {dimensions.height}
      </p>
    )}
  </div>
);

export default App;
