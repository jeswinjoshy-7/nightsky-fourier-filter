#  Export to VS Code Guide

This guide will help you export and set up your FFT Image Filter project in VS Code.

##  Project Structure

```
FFT Image Filter/
├── .vscode/                    # VS Code configuration
│   ├── settings.json          # Editor settings
│   ├── launch.json            # Debug configurations
│   ├── tasks.json             # Build tasks
│   └── extensions.json        # Recommended extensions
├── backend/                   # Express.js backend
│   ├── server.js             # Main server file
│   ├── package.json          # Backend dependencies
│   └── node_modules/         # Backend packages
├── frontend/                  # React frontend
│   ├── src/                  # React source code
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   └── node_modules/         # Frontend packages
├── fft-image-filter.code-workspace  # VS Code workspace
├── README.md                 # Project documentation
├── LICENSE                   # MIT License
└── package.json             # Root package with scripts
```

##  VS Code Setup

### 1. **Open in VS Code**
```bash
# Option 1: Open workspace file
code fft-image-filter.code-workspace

# Option 2: Open folder directly
code .
```

### 2. **Install Recommended Extensions**
VS Code will prompt you to install recommended extensions:
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Path Intellisense
- GitLens
- Thunder Client (for API testing)

### 3. **VS Code Features Available**

####  Tasks (Ctrl+Shift+P → "Tasks: Run Task")**
- **Install All Dependencies**: `npm run install-all`
- **Start Development (Both)**: `npm run dev`
- **Start Backend Only**: `npm run backend`
- **Start Frontend Only**: `npm run frontend`
- **Push to GitHub**: `git push -u origin main`

#### Debug Configurations (F5)**
- **Debug Backend**: Debug the Express.js server
- **Launch Backend**: Run backend with nodemon

####  Settings**
- Format on save enabled
- ESLint auto-fix
- File nesting for cleaner explorer
- Optimized search exclusions

## Quick Start in VS Code

### **Method 1: Using VS Code Tasks**
1. Open VS Code
2. Press `Ctrl+Shift+P`
3. Type "Tasks: Run Task"
4. Select "Install All Dependencies"
5. Wait for installation
6. Select "Start Development (Both)"

### **Method 2: Using Terminal**
1. Open VS Code Terminal (`Ctrl+`` `)
2. Run: `npm run install-all`
3. Run: `npm run dev`

### **Method 3: Using Debug Mode**
1. Press `F5`
2. Select "Debug Backend"
3. Open new terminal: `npm run frontend`

## Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

##  VS Code Features

### **File Explorer**
- Clean project structure
- File nesting for related files
- Hidden node_modules for cleaner view

### **IntelliSense**
- Auto-completion for React components
- TypeScript support
- Path intellisense for imports

### **Git Integration**
- Built-in Git support
- GitLens for enhanced Git features
- Source control panel

### **API Testing**
- Thunder Client for testing backend APIs
- Built-in REST client capabilities

##  Development Workflow

### **Backend Development**
1. Open `backend/server.js`
2. Set breakpoints (F9)
3. Press F5 to debug
4. Use Thunder Client to test APIs

### **Frontend Development**
1. Open `frontend/src/App.js`
2. Make changes
3. Hot reload automatically updates
4. Use React DevTools extension

### **Full Stack Development**
1. Run "Start Development (Both)" task
2. Both servers start automatically
3. Changes in either backend or frontend auto-reload

##  Package Management

### **Install New Dependencies**
```bash
# Backend
cd backend && npm install <package>

# Frontend  
cd frontend && npm install <package>

# Root
npm install <package>
```

### **Update Dependencies**
```bash
# Check for updates
npm outdated

# Update all
npm update
```

##  Deployment

### **Build for Production**
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm start
```

### **Push to GitHub**
- Use "Push to GitHub" task
- Or: `git push -u origin main`

##  Tips for VS Code

1. **Multi-root Workspace**: Use the `.code-workspace` file for better organization
2. **Integrated Terminal**: Use `Ctrl+`` ` for quick terminal access
3. **Command Palette**: `Ctrl+Shift+P` for all VS Code commands
4. **Quick Open**: `Ctrl+P` to quickly open files
5. **Side by Side**: `Ctrl+\` to split editor
6. **Zen Mode**: `F11` for distraction-free coding

##  Troubleshooting

### **Port Conflicts**
If ports 3000/5000 are in use:
```bash
# Kill processes
pkill -f "node server.js"
pkill -f "react-scripts"

# Or change ports in package.json
```

### **Dependencies Issues**
```bash
# Clean install
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
npm run install-all
```

### **VS Code Issues**
- Reload window: `Ctrl+Shift+P` → "Developer: Reload Window"
- Reset settings: Remove `.vscode` folder and recreate

##  Additional Resources

- [VS Code Documentation](https://code.visualstudio.com/docs)
- [Node.js Debugging](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)
- [React Development](https://reactjs.org/docs/development-tools.html)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

Your FFT Image Filter project is now fully configured for VS Code development! 🎉
