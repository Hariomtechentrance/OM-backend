# Black Locust E-commerce Backend API Documentation

## Overview
Complete backend API for Black Locust e-commerce platform serving men's and kids' clothing with full admin panel functionality.

## Base URL
```
http://localhost:5002/api
```

## Authentication
- JWT token-based authentication
- Include token in Authorization header: `Bearer <token>`
- Admin-only routes require admin role

## API Endpoints

### 📦 Products
- `GET /products` - Get all products (with filtering, sorting, pagination)
- `GET /products/featured` - Get featured products
- `GET /products/:id` - Get single product details
- `POST /products` - Create product (Admin only)
- `PUT /products/:id` - Update product (Admin only)
- `DELETE /products/:id` - Delete product (Admin only)

**Query Parameters (GET /products):**
- `category` - Filter by category
- `search` - Search products
- `sort` - Sort options (price-low, price-high, rating)
- `minPrice` / `maxPrice` - Price range filter
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

### 👤 Users
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users` - Get all users (Admin only)
- `PUT /users/:id/role` - Update user role (Admin only)
- `POST /users/wishlist` - Add to wishlist
- `DELETE /users/wishlist/:productId` - Remove from wishlist

### 🛒 Cart
- `POST /cart/add` - Add item to cart
- `GET /cart` - Get user cart
- `GET /cart/summary` - Get cart summary with totals
- `PUT /cart/:itemId` - Update cart item quantity
- `DELETE /cart/:itemId` - Remove item from cart
- `DELETE /cart` - Clear cart

### 📦 Orders
- `POST /orders` - Create new order
- `GET /orders` - Get user orders
- `GET /orders/admin/all` - Get all orders (Admin only)
- `GET /orders/:id` - Get order details
- `PUT /orders/:id/status` - Update order status (Admin only)
- `PUT /orders/:id/pay` - Mark order as paid

### ⭐ Reviews
- `POST /reviews` - Create product review
- `PUT /reviews/:productId` - Update review
- `DELETE /reviews/:productId` - Delete review
- `GET /reviews/product/:productId` - Get product reviews
- `GET /reviews/user` - Get user reviews

### 💳 Payments
- `POST /payments/create-intent` - Create Stripe payment intent
- `POST /payments/confirm` - Confirm payment
- `POST /payments/refund` - Process refund (Admin only)
- `GET /payments/methods` - Get available payment methods
- `POST /payments/webhook` - Stripe webhook handler

### 📊 Analytics (Admin only)
- `GET /analytics/dashboard` - Dashboard statistics
- `GET /analytics/sales` - Sales analytics
- `GET /analytics/products` - Product analytics
- `GET /analytics/customers` - Customer analytics
- `GET /analytics/inventory` - Inventory analytics

### 📧 Email Services
- `POST /email/welcome` - Send welcome email
- `POST /email/order-confirmation` - Send order confirmation
- `POST /email/password-reset` - Send password reset
- `POST /email/promotional` - Send promotional emails (Admin only)

### 📰 Newsletter
- `POST /newsletter/subscribe` - Subscribe to newsletter
- `GET /newsletter/subscribers` - Get subscribers (Admin only)

## Data Models

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String, // 'user' | 'admin'
  phone: String,
  addresses: [{
    addressType: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean
  }],
  wishlist: [ObjectId],
  cart: [{
    product: ObjectId,
    quantity: Number,
    size: String,
    color: String
  }],
  isActive: Boolean
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String, // 'T-Shirts', 'Shirts', 'Pants', 'Jeans', 'Jackets', 'Sweaters', 'Accessories'
  brand: String,
  images: [{
    url: String,
    public_id: String
  }],
  sizes: [String], // 'XS', 'S', 'M', 'L', 'XL', 'XXL'
  colors: [String],
  stock: Number,
  featured: Boolean,
  rating: Number,
  reviews: [{
    user: ObjectId,
    name: String,
    rating: Number,
    comment: String
  }],
  isActive: Boolean
}
```

### Order Model
```javascript
{
  user: ObjectId,
  orderItems: [{
    product: ObjectId,
    name: String,
    quantity: Number,
    size: String,
    color: String,
    image: String,
    price: Number
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: String,
  totalPrice: Number,
  taxPrice: Number,
  shippingPrice: Number,
  isPaid: Boolean,
  paidAt: Date,
  isDelivered: Boolean,
  deliveredAt: Date,
  status: String, // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  trackingNumber: String
}
```

## Error Responses

All endpoints return consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Admin Features

### User Management
- View all registered users with their credentials
- Change user roles (User ↔ Admin)
- Activate/deactivate user accounts
- View user activity and order history

### Product Management
- Add new products with images, sizes, colors
- Update product prices and all details
- Delete products (soft delete)
- Manage inventory and stock levels
- Set featured products

### Order Management
- View all orders with customer details
- Update order status (pending → processing → shipped → delivered)
- Process refunds
- Generate order reports

### Analytics Dashboard
- Real-time sales statistics
- Customer analytics
- Product performance metrics
- Inventory reports
- Revenue tracking

### Email Marketing
- Send promotional emails
- Welcome emails for new users
- Order confirmations
- Password reset emails

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Input validation and sanitization
- Role-based access control
- Helmet security headers

## Environment Variables

Required environment variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/blacklocust

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=5002
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Black Locust <noreply@blacklocust.com>
```

## Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables
3. Seed database: `npm run seed`
4. Start server: `npm run dev`

## Default Admin Account

After seeding the database:
- Email: `admin@blacklocust.com`
- Password: `admin123`

## Testing API Endpoints

Use tools like Postman or curl to test endpoints. Include JWT token for protected routes.

Example login request:
```bash
curl -X POST http://localhost:5002/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@blacklocust.com","password":"admin123"}'
```

## Rate Limiting

- 100 requests per 15 minutes per IP
- Applied to all `/api/` routes
- Prevents abuse and ensures stability

## File Uploads

Image uploads handled via Cloudinary integration (configured in environment variables).

## Webhooks

Stripe webhooks configured for payment status updates at `/api/payments/webhook`.
