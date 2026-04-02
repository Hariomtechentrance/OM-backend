# 🌐 BLACK LOCUST - COMPLETE GODADDY DEPLOYMENT GUIDE

## 📋 TABLE OF CONTENTS
1. [Prerequisites](#prerequisites)
2. [GoDaddy Hosting Setup](#godaddy-hosting-setup)
3. [Database Configuration](#database-configuration)
4. [Backend Configuration](#backend-configuration)
5. [Frontend Build & Upload](#frontend-build--upload)
6. [Environment Variables Setup](#environment-variables-setup)
7. [GoDaddy File Upload](#godaddy-file-upload)
8. [SSL & Domain Setup](#ssl--domain-setup)
9. [Testing & Troubleshooting](#testing--troubleshooting)

---

## 🔑 PREREQUISITES

### ✅ WHAT YOU NEED:
1. **GoDaddy Account** - Already have ✅
2. **Domain Name** - Registered with GoDaddy
3. **GoDaddy Hosting Plan** - Linux cPanel recommended
4. **MongoDB Atlas Account** - Free tier available
5. **Cloudinary Account** - For image hosting

### 🛠️ TECHNICAL REQUIREMENTS:
- **Node.js 18+** - GoDaddy cPanel supports this
- **MongoDB Database** - Atlas recommended for hosting
- **SSL Certificate** - Usually included with GoDaddy
- **File Manager Access** - For uploading files

---

## 🏠 GODADDY HOSTING SETUP

### 📁 STEP 1: CHOOSE YOUR HOSTING PLAN

#### OPTION A: GODADDY CSHARED HOSTING (RECOMMENDED)
```
Features:
✅ Linux cPanel
✅ Node.js Support
✅ MySQL Database
✅ SSL Certificate
✅ File Manager
✅ Email Accounts

Cost: $10-30/month
Best for: Small to medium e-commerce stores
```

#### OPTION B: GODADDY VPS HOSTING
```
Features:
✅ Full Root Access
✅ Install any software
✅ Dedicated resources
✅ MongoDB support
✅ Full control

Cost: $20-100/month
Best for: Large stores with custom needs
```

### 📋 STEP 2: SETUP YOUR GODADDY HOSTING

1. **Log into GoDaddy**
2. **Go to "Web Hosting"**
3. **Choose your plan** (cPanel recommended)
4. **Select domain** to host
5. **Complete setup** and wait for provisioning

---

## 🗄️ DATABASE CONFIGURATION

### 🌐 STEP 1: SETUP MONGODB ATLAS

1. **Go to**: https://www.mongodb.com/atlas
2. **Create free account**
3. **Create new cluster**:
   - **Cloud Provider**: AWS
   - **Region**: Choose nearest to your customers
   - **Cluster Tier**: M0 (Free)
4. **Create database user**:
   - **Username**: blacklocust_user
   - **Password**: Generate strong password
5. **Whitelist IP addresses**:
   - Add GoDaddy server IP
   - Add your local IP for testing
6. **Get connection string**:
   ```
   mongodb+srv://blacklocust_user:PASSWORD@cluster.mongodb.net/blacklocust?retryWrites=true&w=majority
   ```

### 🔧 STEP 2: UPDATE YOUR .ENV.PRODUCTION

Replace in `.env.production`:
```bash
MONGODB_URI=mongodb+srv://blacklocust_user:YOUR_PASSWORD@cluster.mongodb.net/blacklocust?retryWrites=true&w=majority
```

---

## ⚙️ BACKEND CONFIGURATION

### 📝 STEP 1: UPDATE SERVER CONFIGURATION

Edit `server.js` for production:

```javascript
const PORT = process.env.PORT || 80; // GoDaddy uses port 80

// Update CORS for production
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://yourdomain.com',
  credentials: true
}));
```

### 🔐 STEP 2: SECURITY CONFIGURATION

Update security settings for GoDaddy:
```javascript
// Trust proxy for GoDaddy environment
app.set('trust proxy', 1);

// Update rate limiting for production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
```

---

## 📦 FRONTEND BUILD & UPLOAD

### 🏗️ STEP 1: BUILD FOR PRODUCTION

```bash
cd frontend
npm run build
```

This creates:
- **build/** folder** with optimized files
- **Static assets** minified and compressed
- **index.html** with proper paths

### 📤 STEP 2: PREPARE DEPLOYMENT FILES

Run the deployment script:
```bash
cd backend
chmod +x deploy-godaddy.sh
./deploy-godaddy.sh
```

This creates:
- **deployment/** folder** with all files
- **.htaccess** for React Router
- **.env.production** as `.env`

---

## 🌍 ENVIRONMENT VARIABLES SETUP

### 🔑 STEP 1: CONFIGURE ALL SECRETS

Update `.env.production` with your actual values:

```bash
# Database
MONGODB_URI=your-mongodb-atlas-connection-string

# JWT Secrets (generate new ones)
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-here

# Email (GoDaddy SMTP)
EMAIL_HOST=smtpout.secureserver.net
EMAIL_PORT=465
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-godaddy-email-password
EMAIL_FROM=noreply@yourdomain.com

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Domain
FRONTEND_URL=https://yourdomain.com
```

### 🔐 STEP 2: GENERATE SECURE SECRETS

Generate new secrets:
```bash
# JWT Secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Session Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📤 GODADDY FILE UPLOAD

### 📁 STEP 1: ACCESS GODADDY FILE MANAGER

1. **Log into GoDaddy**
2. **Go to "My Products" → "Web Hosting"**
3. **Click "Manage"** on your hosting plan
4. **Launch cPanel**
5. **Go to "File Manager"**

### 📤 STEP 2: UPLOAD YOUR FILES

1. **Navigate to public_html**
2. **Delete existing files** (clean slate)
3. **Upload deployment folder**:
   - Select all files in `deployment/`
   - Upload to `public_html/`
4. **Verify file structure**:
   ```
   public_html/
   ├── index.html
   ├── static/
   │   ├── css/
   │   ├── js/
   │   └── media/
   ├── .htaccess
   └── backend-files/
   ```

### 📤 STEP 3: SET FILE PERMISSIONS

In cPanel File Manager:
1. **Select all uploaded files**
2. **Click "Change Permissions"**
3. **Set to 755** for directories
4. **Set to 644** for files

---

## 🔒 SSL & DOMAIN SETUP

### 🔗 STEP 1: CONFIGURE DOMAIN

1. **In GoDaddy DNS Settings**:
   - **A Record**: @ → GoDaddy server IP
   - **CNAME**: www → @ (your domain)
   - **TTL**: 1 Hour (default)

### 🔒 STEP 2: SETUP SSL CERTIFICATE

GoDaddy usually provides free SSL:
1. **Go to "SSL Certificates"**
2. **Install free certificate** (if available)
3. **Enable HTTPS redirect** in cPanel

### 🔄 STEP 3: FORCE HTTPS REDIRECT

Add to `.htaccess`:
```apache
# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 🧪 TESTING & TROUBLESHOOTING

### ✅ STEP 1: BASIC TESTS

1. **Visit your domain**: https://yourdomain.com
2. **Check frontend loads**: React app should appear
3. **Test API calls**: Browse products, try login
4. **Check console**: No JavaScript errors

### 🔍 STEP 2: COMMON ISSUES & SOLUTIONS

#### ISSUE 1: BLANK PAGE
```
Cause: .htaccess not working
Solution: 
1. Check .htaccess uploaded correctly
2. Verify mod_rewrite enabled
3. Check file permissions (644)
```

#### ISSUE 2: API CALLS FAILING
```
Cause: CORS or backend not running
Solution:
1. Check .env variables
2. Verify MongoDB connection
3. Check backend logs in cPanel
```

#### ISSUE 3: IMAGES NOT LOADING
```
Cause: Cloudinary configuration
Solution:
1. Verify Cloudinary credentials
2. Check upload preset
3. Test image URLs manually
```

#### ISSUE 4: 403 FORBIDDEN ERRORS
```
Cause: File permissions or security
Solution:
1. Check file permissions (644/755)
2. Verify .htaccess syntax
3. Check GoDaddy security settings
```

### 📊 STEP 3: MONITORING

Set up monitoring:
1. **GoDaddy Metrics**: Check server performance
2. **MongoDB Atlas**: Monitor database performance
3. **Google Search Console**: Monitor SEO
4. **Uptime monitoring**: Track website availability

---

## 🚀 PRODUCTION DEPLOYMENT CHECKLIST

### ✅ PRE-DEPLOYMENT CHECKLIST:
- [ ] GoDaddy hosting plan active
- [ ] Domain pointing to GoDaddy
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables configured
- [ ] Frontend built successfully
- [ ] All secrets generated and secured

### ✅ POST-DEPLOYMENT CHECKLIST:
- [ ] Files uploaded to GoDaddy
- [ ] File permissions set correctly
- [ ] SSL certificate active
- [ ] HTTPS redirect working
- [ ] Frontend loads at domain
- [ ] API endpoints responding
- [ ] Database connection working
- [ ] User registration/login working
- [ ] Product browsing working
- [ ] Cart functionality working
- [ ] Checkout process working

---

## 🎯 SUCCESS METRICS

### 📈 WHAT TO MONITOR:
1. **Page Load Speed**: < 3 seconds
2. **Mobile Responsiveness**: All devices
3. **SEO Performance**: Meta tags, structured data
4. **Conversion Rate**: Track sales and signups
5. **Error Rate**: < 1% of requests

### 🛠️ MAINTENANCE TASKS:
1. **Weekly**: Update products, check inventory
2. **Monthly**: Update dependencies, backup database
3. **Quarterly**: Security audit, performance review
4. **Yearly**: SSL renewal, hosting plan review

---

## 🆘️ SUPPORT & RESOURCES

### 📞 GODADDY SUPPORT:
- **Phone**: 480-505-8877
- **Chat**: Available on GoDaddy website
- **Help Center**: https://www.godaddy.com/help

### 📚 TECHNICAL DOCUMENTATION:
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **GoDaddy cPanel**: https://www.godaddy.com/help/cpanel
- **React Deployment**: https://create-react-app.dev/docs/deployment

---

## 🎉 CONCLUSION

Your Black Locust e-commerce platform is now ready for GoDaddy deployment! 

**Key Success Factors:**
✅ Proper hosting plan selection
✅ Secure database configuration
✅ Optimized frontend build
✅ Correct file permissions
✅ SSL certificate setup
✅ Comprehensive testing

**Next Steps:**
1. Follow this guide step-by-step
2. Test thoroughly after deployment
3. Monitor performance regularly
4. Update security as needed

**🌐 Your Black Locust store will be live on GoDaddy!**

---

*Last Updated: March 2026*
*Version: 1.0.0*
