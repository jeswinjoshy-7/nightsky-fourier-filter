# Fourier Transform Image Filter 🎨

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.18+-black.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack application that demonstrates 2D Fast Fourier Transform (FFT) for image noise reduction using low-pass filtering. The application separates the original React application into a backend API and frontend client architecture.

## 🌟 Features

- **Real-time Image Processing**: Upload images and see FFT filtering in real-time
- **Custom FFT Implementation**: Pure JavaScript 2D FFT using Cooley-Tukey algorithm
- **Four-Panel Visualization**: See original, filtered, and frequency domain representations
- **Sample Generation**: Generate noisy night sky images for testing
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Dark theme with professional styling

## 🏗️ Architecture

- **Backend**: Express.js server with image processing capabilities using Sharp and Canvas
- **Frontend**: React application that communicates with the backend API
- **Processing**: Custom FFT implementation for 2D image filtering

## 📁 Project Structure

```
Low-pass FFT/
├── backend/                 # Express.js API server
│   ├── server.js           # Main server file with FFT processing
│   ├── package.json        # Backend dependencies
│   └── uploads/            # Temporary file storage (auto-created)
├── frontend/               # React application
│   ├── public/             # Static assets
│   ├── src/                # React source code
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Styling
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles
│   └── package.json        # Frontend dependencies
├── package.json            # Root package.json with scripts
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jeswinjoshy-7/nightsky-fourier-filter.git
   cd nightsky-fourier-filter
   ```

2. **Install all dependencies (root, backend, and frontend):**
   ```bash
   npm run install-all
   ```

### Running the Application

#### Option 1: Run both backend and frontend together
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

#### Option 2: Run backend and frontend separately

**Terminal 1 - Backend:**
```bash
npm run backend
```

**Terminal 2 - Frontend:**
```bash
npm run frontend
```

### 🌐 Live Demo

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-blue)](https://your-demo-url.com)

*Deploy this application to see it in action!*

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both backend and frontend concurrently
- `npm run backend` - Start only the backend server
- `npm run frontend` - Start only the frontend development server
- `npm run install-all` - Install dependencies for all parts of the application

### Backend (`cd backend`)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend (`cd frontend`)
- `npm start` - Start React development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🛠️ API Endpoints

### Backend Server (Port 5000)

- `GET /api/health` - Health check endpoint
- `POST /api/process-image` - Process image with FFT filter
  - **Body**: FormData with `image` file and `cutoffFreq` parameter
  - **Response**: JSON with original image, filtered image, and spectrum visualizations
- `GET /api/generate-sample` - Generate a sample night sky image with noise

## 🎯 Features

### Backend Features
- **Custom FFT Implementation**: Pure JavaScript implementation of 2D FFT
- **Image Processing**: Uses Sharp for efficient image manipulation
- **Low-pass Filtering**: Configurable cutoff frequency for noise reduction
- **Spectrum Visualization**: Generates frequency domain visualizations
- **File Upload Handling**: Multer middleware for image uploads
- **CORS Support**: Cross-origin requests enabled

### Frontend Features
- **Image Upload**: Drag-and-drop or click to upload images
- **Sample Generation**: Generate noisy night sky images for testing
- **Real-time Filtering**: Adjust cutoff frequency with live preview
- **Four-Panel View**: 
  - Original image (spatial domain)
  - Filtered image (spatial domain)
  - Original FFT spectrum (frequency domain)
  - Filtered FFT spectrum (frequency domain)
- **Download Results**: Export filtered images
- **Responsive Design**: Works on desktop and mobile devices

## 🔬 Technical Details

### FFT Implementation
- **Algorithm**: Cooley-Tukey FFT for powers of 2
- **2D Processing**: Row-wise then column-wise 1D FFTs
- **Padding**: Automatic padding to nearest power of 2
- **Complex Numbers**: Custom complex number operations

### Image Processing Pipeline
1. **Resize**: Images are resized to max 256×256 for performance
2. **Channel Separation**: RGB channels are processed separately
3. **FFT Transform**: Each channel is transformed to frequency domain
4. **Filtering**: Low-pass filter applied with circular mask
5. **Inverse FFT**: Transform back to spatial domain
6. **Reconstruction**: Channels are recombined into final image

### Filter Design
- **Type**: Circular low-pass filter in frequency domain
- **Cutoff**: Configurable radius (1-150 pixels)
- **Effect**: Removes high-frequency noise while preserving image structure

## 🎨 UI/UX Features

- **Dark Theme**: Professional dark interface
- **Loading States**: Visual feedback during processing
- **Error Handling**: User-friendly error messages
- **Responsive Grid**: Adapts to different screen sizes
- **Modern Icons**: Lucide React icons for better UX

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory to customize API URL:
```env
REACT_APP_API_URL=http://localhost:5000
```

### Backend Configuration

The backend server can be configured via environment variables:
- `PORT`: Server port (default: 5000)

## 🚀 Production Deployment

### Backend Deployment
1. Build and deploy the backend server
2. Ensure all dependencies are installed
3. Set appropriate environment variables
4. Configure reverse proxy (nginx/Apache) if needed

### Frontend Deployment
1. Build the React application:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `build` folder to a static hosting service
3. Update `REACT_APP_API_URL` to point to your backend

## 🐛 Troubleshooting

### Common Issues

1. **Canvas installation issues**: The backend uses the `canvas` package which may require additional system dependencies:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
   
   # macOS
   brew install pkg-config cairo pango libpng jpeg giflib librsvg
   ```

2. **Port conflicts**: If ports 3000 or 5000 are in use, modify the scripts in `package.json`

3. **CORS issues**: Ensure the backend is running and accessible from the frontend URL

## 📚 Learning Resources

This application demonstrates:
- 2D Fast Fourier Transform implementation
- Image processing in Node.js
- React frontend with API integration
- Real-time image filtering
- Frequency domain visualization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📸 Screenshots

![Application Interface](https://via.placeholder.com/800x400/1f2937/ffffff?text=FFT+Image+Filter+Interface)
*Four-panel visualization showing original image, filtered result, and frequency domain representations*

## 🔬 Technical Details

### FFT Algorithm
- **Type**: 2D Fast Fourier Transform
- **Implementation**: Cooley-Tukey algorithm for powers of 2
- **Performance**: Optimized for real-time image processing
- **Filter**: Circular low-pass filter in frequency domain

### Tech Stack
- **Backend**: Node.js, Express.js, Sharp, Canvas
- **Frontend**: React, Axios, Lucide React
- **Image Processing**: Custom FFT implementation
- **Styling**: CSS with responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by digital signal processing concepts
- Built with modern web technologies
- Educational project for understanding FFT applications in image processing
