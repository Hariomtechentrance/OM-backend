# 🔒 SECURE SUPABASE SETUP GUIDE

## Step 1: Create Environment Variables

### 1. Create .env.local file in your frontend folder:
```
cd /Users/admin/Desktop/Black Locust/files/black-locust-mern/frontend
touch .env.local
```

### 2. Add your Supabase credentials to .env.local:
```
REACT_APP_SUPABASE_URL=your_actual_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

### 3. Replace with your actual Supabase credentials:
- Go to your Supabase project
- Settings > API
- Copy the Project URL
- Copy the anon public key
- Paste them in the .env.local file

## Step 2: Update Supabase Configuration

### Update src/config/supabase.js:
The file is already created with proper helper functions. Just make sure your environment variables are set.

## Step 3: Database Setup - SAFE SQL Commands

### Run these SQL commands in Supabase SQL Editor one by one:

```sql
-- 1. Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  items JSONB NOT NULL,
  shipping_address JSONB,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create cart table
CREATE TABLE IF NOT EXISTS cart (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, size, color)
);

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_product_id ON cart(product_id);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies
-- Products: Anyone can read, only authenticated users can insert/update
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update their products" ON products FOR UPDATE USING (auth.role() = 'authenticated');

-- User profiles: Users can only see/update their own profile
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Orders: Users can only see/update their own orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);

-- Cart: Users can only see/update their own cart
CREATE POLICY "Users can view own cart" ON cart FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cart items" ON cart FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart items" ON cart FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart items" ON cart FOR DELETE USING (auth.uid() = user_id);

-- 9. Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name)
  VALUES (new.id, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create trigger to automatically create user profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Step 4: Update Your React App

### 1. Update App.js to use Supabase Auth:
Replace the current AuthContext import with:
```javascript
import { AuthProvider } from './context/AuthContextSupabase';
```

### 2. Test the connection:
Create a simple test component to verify Supabase is working.

## Step 5: Sample Data Insertion

### Insert sample products to test:
```sql
INSERT INTO products (name, price, category, description, image_url, stock, rating, featured) VALUES
('Premium Oxford Shirt', 3499.00, 'shirts', 'Elevate your wardrobe with our premium Oxford shirt', '/images/products/shirt1.jpg', 100, 4.8, true),
('Executive Wool Blazer', 8999.00, 'jackets', 'Command attention with our executive wool blazer', '/images/products/blazer1.jpg', 50, 4.9, true),
('Designer Denim Jacket', 4299.00, 'jackets', 'Make a statement with our designer denim jacket', '/images/products/denim1.jpg', 75, 4.7, false),
('Luxury Cotton Polo', 2499.00, 'shirts', 'Experience comfort and style with our luxury cotton polo', '/images/products/polo1.jpg', 120, 4.6, true);
```

## Step 6: Testing Checklist

### Before you proceed:
- [ ] Environment variables are set in .env.local
- [ ] Database tables are created
- [ ] RLS policies are enabled
- [ ] Sample data is inserted
- [ ] App.js is updated with new AuthContext
- [ ] Frontend restarts without errors

### Safety Tips:
1. Never commit .env.local to git
2. Test with small amounts of data first
3. Backup your database before major changes
4. Use Supabase backup features
5. Monitor your usage and costs

## Step 7: Gradual Migration

### Phase 1: Authentication only
- Test login/register functionality
- Verify user profiles are created
- Check RLS policies work

### Phase 2: Products integration
- Update ProductsPage to use Supabase
- Test product listing and filtering
- Verify product details work

### Phase 3: Cart and Orders
- Update CartContext to use Supabase
- Test cart functionality
- Test order creation

### Phase 4: Full integration
- Remove old mock data
- Test all features
- Deploy to production

## Troubleshooting:

### Common Issues:
1. "CORS error" - Check Supabase settings > API > CORS
2. "RLS policy violation" - Check your policies in SQL Editor
3. "Connection refused" - Verify your environment variables
4. "Table not found" - Run the SQL commands again

### Debug Steps:
1. Check browser console for errors
2. Verify Supabase dashboard logs
3. Test SQL commands in Supabase SQL Editor
4. Check network tab for API calls

This guide ensures safe, step-by-step integration without breaking your existing functionality!
