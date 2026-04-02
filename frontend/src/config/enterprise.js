// 🚀 ENTERPRISE SCALING CONFIGURATION FOR BLACK LOCUST

// 1. Performance Optimization
export const performanceConfig = {
  // Code Splitting for better performance
  lazyLoading: {
    components: true,
    images: true,
    routes: true
  },
  
  // Caching Strategy
  cache: {
    products: '30min', // Cache products for 30 minutes
    categories: '1hour', // Cache categories for 1 hour
    images: '24hours', // Cache images for 24 hours
    staticAssets: '7days' // Cache static assets for 7 days
  },
  
  // Image Optimization
  images: {
    formats: ['webp', 'avif', 'jpg'],
    sizes: [400, 800, 1200, 1600],
    quality: 85,
    lazy: true
  }
}

// 2. CDN and Asset Management
export const cdnConfig = {
  // Use Cloudflare or AWS CloudFront
  cdnUrl: process.env.REACT_APP_CDN_URL || 'https://cdn.blacklocust.com',
  
  // Asset optimization
  optimizeAssets: {
    images: true,
    javascript: true,
    css: true,
    fonts: true
  },
  
  // Global edge locations
  edgeLocations: [
    'us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1',
    'ap-northeast-1', 'ca-central-1', 'sa-east-1'
  ]
}

// 3. Database Scaling Strategy
export const databaseConfig = {
  // Connection Pooling
  connectionPool: {
    min: 10,
    max: 100,
    idleTimeoutMillis: 30000
  },
  
  // Read Replicas for scaling reads
  readReplicas: 3,
  
  // Caching Layer
  redis: {
    enabled: true,
    ttl: 3600, // 1 hour
    cluster: true
  },
  
  // Database Optimization
  indexes: [
    'products_category_idx',
    'products_price_idx',
    'products_name_idx',
    'orders_user_id_idx',
    'orders_created_at_idx'
  ]
}

// 4. API Rate Limiting
export const rateLimitConfig = {
  // Different limits for different user types
  limits: {
    anonymous: {
      requests: 100,
      window: '15min'
    },
    authenticated: {
      requests: 1000,
      window: '15min'
    },
    premium: {
      requests: 5000,
      window: '15min'
    },
    admin: {
      requests: 10000,
      window: '15min'
    }
  }
}

// 5. Security Configuration
export const securityConfig = {
  // DDoS Protection
  ddosProtection: {
    enabled: true,
    threshold: 10000, // requests per minute
    blacklistDuration: 3600 // 1 hour
  },
  
  // API Security
  apiSecurity: {
    cors: true,
    helmet: true,
    rateLimit: true,
    inputValidation: true,
    sqlInjectionProtection: true
  },
  
  // Authentication Security
  authSecurity: {
    jwtExpiry: '24h',
    refreshTokenExpiry: '7d',
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }
  }
}

// 6. Monitoring and Analytics
export const monitoringConfig = {
  // Performance Monitoring
  performance: {
    enabled: true,
    sampleRate: 0.1, // 10% of users
    metrics: ['ttfb', 'fcp', 'lcp', 'cls', 'fid']
  },
  
  // Error Tracking
  errorTracking: {
    enabled: true,
    service: 'sentry', // or 'bugsnag'
    environment: process.env.NODE_ENV
  },
  
  // User Analytics
  analytics: {
    enabled: true,
    service: 'google-analytics',
    trackingId: process.env.REACT_APP_GA_TRACKING_ID
  }
}

// 7. Load Balancing
export const loadBalancingConfig = {
  // Application Load Balancer
  alb: {
    algorithm: 'round_robin',
    healthCheck: {
      path: '/health',
      interval: 30,
      timeout: 5,
      healthyThreshold: 2,
      unhealthyThreshold: 3
    }
  },
  
  // Auto Scaling
  autoScaling: {
    minInstances: 2,
    maxInstances: 50,
    targetCPU: 70,
    targetMemory: 80,
    scaleUpCooldown: 300,
    scaleDownCooldown: 300
  }
}

// 8. Search Engine Optimization
export const seoConfig = {
  // Meta Tags
  metaTags: {
    title: 'Black Locust - Premium Fashion & Clothing',
    description: 'Shop premium fashion and clothing at Black Locust. Quality apparel for the modern individual.',
    keywords: 'fashion, clothing, premium, apparel, style',
    ogImage: '/images/og-image.jpg'
  },
  
  // Structured Data
  structuredData: {
    organization: true,
    products: true,
    breadcrumbs: true,
    reviews: true
  },
  
  // Sitemap
  sitemap: {
    enabled: true,
    changefreq: 'daily',
    priority: 0.8
  }
}

// 9. Email Configuration
export const emailConfig = {
  // Transactional Emails
  transactional: {
    provider: 'sendgrid', // or 'ses', 'mailgun'
    templates: {
      welcome: 'welcome-template',
      orderConfirmation: 'order-confirmation',
      passwordReset: 'password-reset',
      shippingUpdate: 'shipping-update'
    }
  },
  
  // Marketing Emails
  marketing: {
    provider: 'mailchimp',
    lists: {
      newsletter: 'newsletter-list',
      promotions: 'promotions-list'
    }
  }
}

// 10. Payment Processing
export const paymentConfig = {
  // Multiple Payment Gateways
  gateways: {
    stripe: {
      enabled: true,
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    },
    razorpay: {
      enabled: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      keySecret: process.env.RAZORPAY_KEY_SECRET
    },
    paypal: {
      enabled: true,
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET
    }
  },
  
  // Payment Security
  security: {
    pciCompliance: true,
    fraudDetection: true,
    threeDSecure: true
  }
}

// 11. Inventory Management
export const inventoryConfig = {
  // Real-time Inventory
  realTimeUpdates: {
    enabled: true,
    websocket: true,
    cacheTTL: 60 // seconds
  },
  
  // Stock Alerts
  alerts: {
    lowStock: {
      threshold: 10,
      email: true,
      sms: true
    },
    outOfStock: {
      email: true,
      sms: true,
      webhook: true
    }
  }
}

// 12. Customer Support
export const supportConfig = {
  // Live Chat
  liveChat: {
    enabled: true,
    provider: 'intercom', // or 'zendesk', 'crisp'
    businessHours: {
      monday: '9:00-18:00',
      tuesday: '9:00-18:00',
      wednesday: '9:00-18:00',
      thursday: '9:00-18:00',
      friday: '9:00-18:00',
      saturday: '10:00-16:00',
      sunday: 'closed'
    }
  },
  
  // Help Desk
  helpDesk: {
    enabled: true,
    provider: 'zendesk',
    ticketSystem: true,
    knowledgeBase: true
  }
}

export default {
  performance: performanceConfig,
  cdn: cdnConfig,
  database: databaseConfig,
  rateLimit: rateLimitConfig,
  security: securityConfig,
  monitoring: monitoringConfig,
  loadBalancing: loadBalancingConfig,
  seo: seoConfig,
  email: emailConfig,
  payment: paymentConfig,
  inventory: inventoryConfig,
  support: supportConfig
}
