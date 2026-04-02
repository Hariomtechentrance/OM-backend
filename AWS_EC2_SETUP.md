# AWS EC2 BACKEND SETUP

## 1. Create EC2 Instance
- Go to AWS Console > EC2
- Click "Launch instance"
- AMI: Amazon Linux 2 or Ubuntu 20.04
- Instance type: t3.medium
- Storage: 30GB SSD
- Security group: Allow ports 22, 80, 443, 5002

## 2. Server Setup Commands
```bash
# Update server
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Git
sudo yum install -y git

# Clone your project
git clone [your-repo-url]
cd black-locust-mern/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with AWS RDS credentials

# Start with PM2
pm2 start server.js --name "blacklocust-backend"
pm2 startup
pm2 save
```

## 3. Environment Variables
```bash
# .env file
NODE_ENV=production
PORT=5002
DATABASE_URL=postgresql://postgres:[password]@[rds-endpoint]:5432/postgres
JWT_SECRET=[your-jwt-secret]
AWS_ACCESS_KEY_ID=[your-aws-access-key]
AWS_SECRET_ACCESS_KEY=[your-aws-secret-key]
AWS_REGION=us-east-1
```

## 4. Security
- Configure firewall
- Set up SSL certificate
- Enable monitoring
- Set up backups
