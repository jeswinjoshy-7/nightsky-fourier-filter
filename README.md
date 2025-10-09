# Fourier Transform Image Filter

A full-stack application that demonstrates 2D Fast Fourier Transform (FFT) for image noise reduction using low-pass filtering. The application separates the original React application into a backend API and frontend client architecture.

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

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd "Low-pass FFT"
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

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and development purposes.
