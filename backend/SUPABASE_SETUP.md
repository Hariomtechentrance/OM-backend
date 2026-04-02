# Supabase Setup for Black Locust E-Commerce

## 🚀 Why Supabase?
- ✅ PostgreSQL database (more robust than MongoDB)
- ✅ Real-time subscriptions
- ✅ Built-in authentication
- ✅ File storage
- ✅ Auto-generated APIs
- ✅ Free tier available
- ✅ Easy to use dashboard

## 📋 Setup Steps:

### 1. Create Supabase Account
1. Go to: https://supabase.com
2. Sign up for free account
3. Create new project
4. Choose a database password
5. Select region closest to you

### 2. Get Project Credentials
1. In Supabase dashboard → Settings → API
2. Copy:
   - Project URL
   - anon public key
   - service_role key

### 3. Install Supabase Client
```bash
cd backend
npm install @supabase/supabase-js
```

### 4. Create Supabase Configuration
Create `backend/config/supabase.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
```

### 5. Update Environment Variables
Create `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT Configuration
JWT_SECRET=your-jwt-secret-here

# Server Configuration
PORT=5002
NODE_ENV=development

# Frontend Configuration
FRONTEND_URL=http://localhost:3019
```

### 6. Database Schema Setup
Run these SQL commands in Supabase SQL Editor:

```sql
-- Users Table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  phone VARCHAR(20),
  wishlist TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  addresses JSONB DEFAULT '[]',
  cart JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  brand VARCHAR(100),
  images JSONB DEFAULT '[]',
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  num_reviews INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  reviews JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  order_items JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Table
CREATE TABLE newsletters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

### 7. Update Backend Controllers
Replace MongoDB operations with Supabase operations in controllers.

### 8. Benefits of Supabase:
- ✅ PostgreSQL (more reliable than MongoDB)
- ✅ Real-time data synchronization
- ✅ Built-in authentication system
- ✅ File storage for product images
- ✅ Auto-generated REST API
- ✅ Row level security
- ✅ Free tier (500MB database)
- ✅ Easy dashboard interface
- ✅ Automatic backups
- ✅ Global CDN

### 9. Migration Steps:
1. Export current MongoDB data
2. Import to Supabase
3. Update backend code
4. Test all functionality
5. Deploy to production

Would you like me to help you implement this Supabase setup?
