# AWS RDS SETUP GUIDE

## 1. Create AWS RDS Instance
- Go to AWS Console > RDS
- Click "Create database"
- Choose "PostgreSQL"
- Engine version: Latest
- Template: Free tier or Production
- Instance class: db.t3.micro (free) or db.t3.medium (production)
- Storage: 20GB minimum
- Multi-AZ: Yes (for production)
- Username: postgres
- Password: [strong password]

## 2. Security Configuration
- VPC: Create new VPC
- Security group: Allow port 5432
- Backup: Enable automated backups
- Maintenance: Preferred window

## 3. Connection Details
- Endpoint: [database-endpoint].rds.amazonaws.com
- Port: 5432
- Database: postgres
- Username: postgres

## 4. Update Environment Variables
DATABASE_URL=postgresql://postgres:[password]@[endpoint]:5432/postgres
DB_HOST=[endpoint]
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=[password]
