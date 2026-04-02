# MongoDB Atlas Setup for Production

## 1. Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/atlas
2. Sign up for free account
3. Create new cluster (free tier available)

## 2. Get Connection String
1. In Atlas, go to Database → Connect
2. Choose "Connect your application"
3. Copy the connection string

## 3. Update Environment Variables
Create `.env` file in backend directory:

```
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/blacklocust?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Server Port
PORT=5002

# Frontend URL
FRONTEND_URL=http://localhost:3019
```

## 4. Install Required Packages
```bash
npm install dotenv
```

## 5. Update Server Configuration
The server.js already uses process.env.MONGODB_URI, so just add the .env file.

## 6. Restart Backend
```bash
npm start
```

## Benefits of MongoDB Atlas:
- ✅ Cloud-based, no local setup needed
- ✅ Automatic backups
- ✅ Scalable
- ✅ Free tier available (512MB)
- ✅ Global CDN
- ✅ Security features
