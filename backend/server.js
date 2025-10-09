const express = require('express');
const multer = require('multer');
const cors = require('cors');
const sharp = require('sharp');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// --- FFT Implementation ---
class FFTProcessor {
  // Complex number operations
  static complexMult(a, b) {
    return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
  }

  static complexAdd(a, b) {
    return { re: a.re + b.re, im: a.im + b.im };
  }

  // 1D FFT implementation (Cooley-Tukey)
  static fft(x) {
    const N = x.length;
    if (N <= 1) return x;
    if (N % 2 !== 0) throw new Error('FFT size must be a power of 2');

    const even = this.fft(x.filter((_, i) => i % 2 === 0));
    const odd = this.fft(x.filter((_, i) => i % 2 === 1));

    const result = new Array(N);
    for (let k = 0; k < N / 2; k++) {
      const angle = -2 * Math.PI * k / N;
      const t = this.complexMult({ re: Math.cos(angle), im: Math.sin(angle) }, odd[k]);
      result[k] = this.complexAdd(even[k], t);
      result[k + N / 2] = this.complexAdd(even[k], { re: -t.re, im: -t.im });
    }
    return result;
  }

  // 1D Inverse FFT
  static ifft(X) {
    const N = X.length;
    const conjugate = X.map(x => ({ re: x.re, im: -x.im }));
    const result = this.fft(conjugate);
    return result.map(x => ({ re: x.re / N, im: -x.im / N }));
  }

  // 2D FFT with padding to power of 2
  static fft2d(data, width, height) {
    const pw2Width = 1 << Math.ceil(Math.log2(width));
    const pw2Height = 1 << Math.ceil(Math.log2(height));
    let result = Array(pw2Height).fill(0).map(() => Array(pw2Width).fill(0).map(() => ({ re: 0, im: 0 })));
    
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        result[i][j] = { re: data[i * width + j], im: 0 };
      }
    }
    
    for (let i = 0; i < pw2Height; i++) {
      result[i] = this.fft(result[i]);
    }
    
    for (let j = 0; j < pw2Width; j++) {
      const col = result.map(row => row[j]);
      const fftCol = this.fft(col);
      for (let i = 0; i < pw2Height; i++) {
        result[i][j] = fftCol[i];
      }
    }
    
    return result;
  }

  // 2D Inverse FFT
  static ifft2d(fftData) {
    const height = fftData.length;
    const width = fftData[0].length;
    let result = fftData.map(row => [...row]);
    
    for (let j = 0; j < width; j++) {
      const col = result.map(row => row[j]);
      const ifftCol = this.ifft(col);
      for (let i = 0; i < height; i++) {
        result[i][j] = ifftCol[i];
      }
    }
    
    for (let i = 0; i < height; i++) {
      result[i] = this.ifft(result[i]);
    }
    
    return result;
  }

  // Shifts the zero-frequency component to the center for visualization
  static fftshift(data) {
    const height = data.length;
    const width = data[0].length;
    const midH = Math.floor(height / 2);
    const midW = Math.floor(width / 2);
    const out = Array(height).fill(0).map(() => Array(width));
    
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        out[i][j] = data[(i + midH) % height][(j + midW) % width];
      }
    }
    
    return out;
  }

  // Generate FFT visualization data
  static visualizeFFT(fftData) {
    const height = fftData.length;
    const width = fftData[0].length;
    const shifted = this.fftshift(fftData);
    
    const magnitudes = shifted.map(row => 
      row.map(c => Math.log(1 + Math.sqrt(c.re * c.re + c.im * c.im)))
    );

    let maxMag = 0;
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (magnitudes[i][j] > maxMag) maxMag = magnitudes[i][j];
      }
    }

    const imageData = [];
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const val = Math.floor((magnitudes[i][j] / maxMag) * 255);
        imageData.push(val, val, val, 255); // RGBA
      }
    }
    
    return { imageData, width, height };
  }

  // Apply low-pass filter
  static applyLowPassFilter(fftData, cutoffFreq) {
    const height = fftData.length;
    const width = fftData[0].length;
    const centerY = Math.floor(height / 2);
    const centerX = Math.floor(width / 2);
    
    const filtered = fftData.map(row => row.map(cell => ({ ...cell })));
    
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const dy = i < centerY ? i : i - height;
        const dx = j < centerX ? j : j - width;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > cutoffFreq) {
          filtered[i][j] = { re: 0, im: 0 };
        }
      }
    }
    
    return filtered;
  }
}

// --- Routes ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FFT Image Processing API is running' });
});

// Process image with FFT filter
app.post('/api/process-image', upload.single('image'), async (req, res) => {
  try {
    const { cutoffFreq = 30 } = req.body;
    const cutoff = parseInt(cutoffFreq);

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Process image with Sharp
    const imageBuffer = req.file.buffer;
    const { data, info } = await sharp(imageBuffer)
      .resize(256, 256, { fit: 'inside', withoutEnlargement: true })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const totalPixels = width * height;

    // Extract color channels
    const redChannel = [];
    const greenChannel = [];
    const blueChannel = [];
    const luminance = [];

    for (let i = 0; i < totalPixels; i++) {
      const pixelIndex = i * channels;
      redChannel.push(data[pixelIndex]);
      greenChannel.push(data[pixelIndex + 1]);
      blueChannel.push(data[pixelIndex + 2]);
      
      // Calculate luminance
      const l = 0.299 * data[pixelIndex] + 0.587 * data[pixelIndex + 1] + 0.114 * data[pixelIndex + 2];
      luminance.push(l);
    }

    // Process FFT for original spectrum visualization
    const fftLuminance = FFTProcessor.fft2d(luminance, width, height);
    const originalSpectrum = FFTProcessor.visualizeFFT(fftLuminance);

    // Apply filter to each channel
    const channels_fft = [redChannel, greenChannel, blueChannel].map(channel => 
      FFTProcessor.fft2d(channel, width, height)
    );

    const filteredChannels = channels_fft.map(fftResult => {
      const filtered = FFTProcessor.applyLowPassFilter(fftResult, cutoff);
      const reconstructed = FFTProcessor.ifft2d(filtered);
      
      return reconstructed.slice(0, height).map(row => 
        row.slice(0, width).map(c => Math.max(0, Math.min(255, c.re)))
      ).flat();
    });

    // Create filtered spectrum visualization
    const filteredLuminance = FFTProcessor.applyLowPassFilter(fftLuminance, cutoff);
    const filteredSpectrum = FFTProcessor.visualizeFFT(filteredLuminance);

    // Create filtered image
    const filteredImageData = new Uint8ClampedArray(totalPixels * 4);
    for (let i = 0; i < totalPixels; i++) {
      filteredImageData[i * 4] = filteredChannels[0][i];     // R
      filteredImageData[i * 4 + 1] = filteredChannels[1][i]; // G
      filteredImageData[i * 4 + 2] = filteredChannels[2][i]; // B
      filteredImageData[i * 4 + 3] = 255;                    // A
    }

    // Convert to base64 images
    const originalImage = await sharp(imageBuffer)
      .resize(width, height, { fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer();

    const filteredImage = await sharp(Buffer.from(filteredImageData), { 
      raw: { width, height, channels: 4 } 
    }).png().toBuffer();

    const originalSpectrumImage = await sharp(Buffer.from(originalSpectrum.imageData), { 
      raw: { width: originalSpectrum.width, height: originalSpectrum.height, channels: 4 } 
    }).png().toBuffer();

    const filteredSpectrumImage = await sharp(Buffer.from(filteredSpectrum.imageData), { 
      raw: { width: filteredSpectrum.width, height: filteredSpectrum.height, channels: 4 } 
    }).png().toBuffer();

    res.json({
      success: true,
      originalImage: `data:image/png;base64,${originalImage.toString('base64')}`,
      filteredImage: `data:image/png;base64,${filteredImage.toString('base64')}`,
      originalSpectrum: `data:image/png;base64,${originalSpectrumImage.toString('base64')}`,
      filteredSpectrum: `data:image/png;base64,${filteredSpectrumImage.toString('base64')}`,
      dimensions: { width, height }
    });

  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: 'Image processing failed', details: error.message });
  }
});

// Generate sample night sky image
app.get('/api/generate-sample', async (req, res) => {
  try {
    const canvas = createCanvas(256, 256);
    const ctx = canvas.getContext('2d');

    // Create night sky background
    ctx.fillStyle = '#000814';
    ctx.fillRect(0, 0, 256, 256);
    
    // Add stars
    for (let i = 0; i < 70; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const brightness = Math.random() * 100 + 155;
      const size = Math.random() * 1.5 + 0.5;
      
      ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add noise
    const imageData = ctx.getImageData(0, 0, 256, 256);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 80;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const buffer = canvas.toBuffer('image/png');
    const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;
    
    res.json({
      success: true,
      image: base64Image
    });

  } catch (error) {
    console.error('Sample generation error:', error);
    res.status(500).json({ error: 'Sample generation failed', details: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FFT Image Processing API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
