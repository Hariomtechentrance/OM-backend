# 🚀 BLACK LOCUST MERN STACK - COMPLETE SETUP GUIDE

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
   ```bash
   node --version
   npm --version
   ```

2. **MongoDB** 
   - Local: Download from https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas

3. **Git**
   ```bash
   git --version
   ```

## 🛠️ Step-by-Step Installation

### 1. Extract the Project
```bash
# If you received a ZIP file, extract it
unzip black-locust-mern.zip
cd black-locust-mern
```

### 2. Install All Dependencies
```bash
# Option A: Install all at once (recommended)
npm run install:all

# Option B: Install manually
npm install          # Root dependencies
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure Backend Environment
```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your settings:
```env
MONGODB_URI=mongodb://localhost:27017/blacklocust
JWT_SECRET=your_super_secret_jwt_key_change_this
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

### 4. Start MongoDB
```bash
# If using local MongoDB:
# Windows: MongoDB should start automatically as a service
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Verify MongoDB is running:
# Open new terminal and run:
mongo
# or
mongosh
```

### 5. Seed Sample Data (Optional)
```bash
cd backend
npm run seed
```

This creates sample products, users, and categories.

### 6. Start Development Servers

#### Option A: Start Both Servers Together (Recommended)
```bash
# From root directory
npm run dev
```

This runs:
- Backend on http://localhost:5000
- Frontend on http://localhost:3000

#### Option B: Start Servers Separately
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### 7. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 🧪 Testing the Application

### Test Backend API
```bash
# Get all products
curl http://localhost:5000/api/products

# Get featured products
curl http://localhost:5000/api/products/featured

# Health check
curl http://localhost:5000/api/health
```

### Test Frontend
1. Open http://localhost:3000
2. You should see the Black Locust homepage with:
   - Animated header with logo
   - Hero section with "ELEVATE YOUR STYLE"
   - Product catalog
   - Newsletter subscription
   - Footer

## 📦 Building for Production

### Backend
```bash
cd backend
npm start  # Production mode
```

### Frontend
```bash
cd frontend
npm run build
# Creates optimized build in frontend/build/
```

## 🚀 Deployment Options

### Backend Deployment

#### Option 1: Heroku
```bash
cd backend
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

#### Option 2: Railway
1. Go to https://railway.app
2. Connect GitHub repo
3. Deploy from backend folder
4. Add environment variables

#### Option 3: Render
1. Go to https://render.com
2. New Web Service
3. Connect repo
4. Set build command: `cd backend && npm install`
5. Set start command: `node server.js`

### Frontend Deployment

#### Option 1: Vercel
```bash
cd frontend
npm install -g vercel
vercel
```

#### Option 2: Netlify
```bash
cd frontend
npm run build
# Drag and drop build/ folder to Netlify
```

## 🔧 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
# Check status
# Mac:
brew services list | grep mongodb

# Linux:
sudo systemctl status mongod

# Start if not running:
brew services start mongodb-community  # Mac
sudo systemctl start mongod           # Linux
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill process using the port
```bash
# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS Errors
**Solution**: Make sure backend .env has correct FRONTEND_URL
```env
FRONTEND_URL=http://localhost:3000
```

### npm install fails
**Solution**: Clear npm cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📚 Useful Commands

```bash
# Install new package in backend
cd backend
npm install package-name

# Install new package in frontend
cd frontend
npm install package-name

# Run backend in watch mode
cd backend
npm run dev

# Check MongoDB connection
mongosh
show dbs
use blacklocust
show collections

# View logs
cd backend
npm run dev  # Shows all request logs

# Format code (if ESLint/Prettier installed)
npm run format
```

## 🎯 Next Steps

1. **Customize the Design**
   - Edit frontend/src/styles/main.css
   - Modify components in frontend/src/components/

2. **Add More Products**
   - Use backend/config/seeder.js
   - Or create products via API

3. **Implement Payment**
   - Add Stripe integration
   - Update orderController.js

4. **Add Email Notifications**
   - Configure nodemailer in backend
   - Send order confirmations

5. **Implement User Authentication**
   - Complete userController.js
   - Add protected routes

## 📞 Support Resources

- **MongoDB**: https://docs.mongodb.com
- **Express**: https://expressjs.com
- **React**: https://react.dev
- **Node.js**: https://nodejs.org/docs

## ✅ Verification Checklist

- [ ] Node.js installed
- [ ] MongoDB running
- [ ] Dependencies installed (root, backend, frontend)
- [ ] .env file configured in backend
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access homepage
- [ ] Can see products
- [ ] MongoDB has data

---

**Congratulations!** 🎉 Your Black Locust MERN Stack application is now running!
