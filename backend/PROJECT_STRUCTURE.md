# BLACK LOCUST BACKEND PROJECT STRUCTURE

backend/
├── config/
│   ├── database.js          # MongoDB connection
│   ├── auth.js             # JWT config
│   └── upload.js           # File upload config
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Order.js             # Order schema
│   ├── Cart.js              # Cart schema
│   └── Review.js            # Review schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── products.js          # Product routes
│   ├── orders.js            # Order routes
│   ├── cart.js              # Cart routes
│   ├── users.js             # User routes
│   ├── upload.js            # File upload routes
│   └── payments.js          # Payment routes
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── validation.js        # Input validation
│   └── errorHandler.js     # Error handling
├── utils/
│   ├── email.js             # Email utilities
│   ├── payment.js           # Payment utilities
│   └── helpers.js           # Helper functions
├── controllers/
│   ├── authController.js     # Auth logic
│   ├── productController.js  # Product logic
│   ├── orderController.js    # Order logic
│   └── userController.js    # User logic
├── uploads/                # File upload directory
├── logs/                  # Log files
├── .env                   # Environment variables
├── .gitignore
├── package.json
└── server.js               # Main server file
