#!/bin/bash

# BLACK LOCUST - GODADDY DEPLOYMENT SCRIPT
echo "🚀 BLACK LOCUST GODADDY DEPLOYMENT STARTED..."

# Step 1: Build Frontend for Production
echo "📦 Building frontend for production..."
cd frontend
npm run build

# Step 2: Create deployment package
echo "📦 Creating deployment package..."
cd ..
mkdir -p godaddy-deployment
cp -r frontend/build/* godaddy-deployment/
cp -r backend/* godaddy-deployment/
cp backend/.env.production godaddy-deployment/.env

# Step 3: Create production .htaccess
echo "📝 Creating .htaccess for GoDaddy..."
cat > godaddy-deployment/.htaccess << 'EOF'
# BLACK LOCUST - GODADDY .HTACCESS CONFIGURATION

# Enable URL Rewriting
Options -MultiViews
RewriteEngine On

# Handle React Router - Redirect all non-file requests to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Access-Control-Allow-Origin "https://your-domain.com"
    Header always set Access-Control-Allow-Credentials "true"
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache Control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/ico "access plus 1 year"
    ExpiresByType image/icon "access plus 1 year"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# PHP Handler (for GoDaddy)
AddHandler application/x-httpd-php .php

# Default Index Files
DirectoryIndex index.html index.php

# Block access to sensitive files
<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>

<FilesMatch "^(env|config|\.env)">
    Order allow,deny
    Deny from all
</FilesMatch>

# Allow API requests
<Files "server.js">
    Options +ExecCGI
    AddHandler cgi-script .js
</Files>
EOF

# Step 4: Create deployment instructions
echo "📋 Creating deployment instructions..."
cat > godaddy-deployment/DEPLOYMENT-INSTRUCTIONS.txt << 'EOF'
BLACK LOCUST - GODADDY DEPLOYMENT INSTRUCTIONS
============================================

STEP 1: UPLOAD FILES
------------------
1. Log into GoDaddy cPanel
2. Go to File Manager
3. Navigate to public_html/
4. Delete all existing files
5. Upload all files from this folder

STEP 2: CONFIGURE ENVIRONMENT
------------------------------
1. Edit the .env file with your actual values:
   - your-domain.com → Replace with your actual domain
   - YOUR_PASSWORD → Replace with MongoDB password
   - your-secret-keys → Replace with generated secrets

STEP 3: SET FILE PERMISSIONS
------------------------------
1. Select all files in File Manager
2. Click "Change Permissions"
3. Set directories to 755
4. Set files to 644

STEP 4: CONFIGURE DOMAIN
-------------------------
1. In GoDaddy DNS settings:
   - A Record: @ → GoDaddy server IP
   - CNAME: www → @
   - TTL: 1 Hour

STEP 5: SETUP SSL
----------------
1. Go to SSL Certificates in cPanel
2. Install free SSL certificate
3. Enable HTTPS redirect

STEP 6: TEST WEBSITE
-------------------
1. Visit https://your-domain.com
2. Check if frontend loads
3. Test user registration
4. Test product browsing

TROUBLESHOOTING:
-----------------
- Blank page: Check .htaccess and file permissions
- API errors: Verify .env configuration
- Database errors: Check MongoDB connection string
- Images not loading: Verify Cloudinary settings

SUPPORT:
--------
- GoDaddy Support: 480-505-8877
- MongoDB Atlas: https://docs.atlas.mongodb.com
EOF

echo "✅ Deployment package created successfully!"
echo "📁 Location: godaddy-deployment/"
echo "📋 Next steps:"
echo "1. Complete MongoDB Atlas setup"
echo "2. Update .env with your actual values"
echo "3. Upload to GoDaddy File Manager"
echo "4. Set file permissions (644/755)"
echo "5. Configure domain and SSL"
echo "🌐 Your website will be live on GoDaddy!"
