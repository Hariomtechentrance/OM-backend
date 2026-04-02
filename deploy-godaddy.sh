#!/bin/bash

# Black Locust GoDaddy Deployment Script
echo "🚀 Starting Black Locust GoDaddy Deployment..."

# Step 1: Build Frontend for Production
echo "📦 Building frontend for production..."
cd ../frontend
npm run build

# Step 2: Create deployment package
echo "📦 Creating deployment package..."
mkdir -p ../deployment
cp -r build/* ../deployment/
cp -r ../backend/* ../deployment/
cp ../deployment/.env.production ../deployment/.env

# Step 3: Create .htaccess for GoDaddy
echo "📝 Creating .htaccess for GoDaddy..."
cat > ../deployment/.htaccess << 'EOF'
# Black Locust React App .htaccess for GoDaddy
Options -MultiViews
RewriteEngine On

# Handle React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'"
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
EOF

echo "✅ Deployment package created successfully!"
echo "📁 Deployment files ready in: ../deployment"
echo "🌐 Next steps:"
echo "1. Upload deployment folder to GoDaddy"
echo "2. Set up MongoDB Atlas"
echo "3. Configure environment variables"
echo "4. Test the live website"
