# AWS S3 + CloudFront SETUP

## 1. Create S3 Bucket
- Go to AWS Console > S3
- Click "Create bucket"
- Bucket name: blacklocust-frontend
- Region: us-east-1
- Block public access: No
- Versioning: Enabled

## 2. Build React App
```bash
cd /Users/admin/Desktop/Black Locust/files/black-locust-mern/frontend
npm run build
```

## 3. Upload to S3
```bash
# Install AWS CLI
pip install awscli

# Configure AWS
aws configure

# Sync build folder to S3
aws s3 sync build/ s3://blacklocust-frontend --delete
```

## 4. Configure S3 for Static Hosting
- Go to S3 bucket > Properties
- Enable "Static website hosting"
- Index document: index.html
- Error document: index.html

## 5. CloudFront Distribution
- Go to AWS Console > CloudFront
- Create distribution
- Origin: S3 bucket (blacklocust-frontend)
- Viewer protocol: Redirect HTTP to HTTPS
- Allowed HTTP methods: GET, HEAD, OPTIONS
- Cache policy: Managed-CachingOptimized

## 6. Update Route 53
- Go to Route 53 > Hosted zones
- Create A record
- Alias: Yes
- Target: CloudFront distribution

## 7. Environment Variables for Production
```bash
# frontend/.env.production
REACT_APP_API_URL=https://api.blacklocust.com
REACT_APP_ENV=production
```
