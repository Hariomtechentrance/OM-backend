import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Collection from '../models/Collection.js';
import Category from '../models/Category.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blacklocust')
  .then(() => console.log('✅ MongoDB Connected for full product import'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Get existing data
const getExistingData = async () => {
  const categories = await Category.find({});
  const collections = await Collection.find({});
  
  const categoryMap = {};
  const collectionMap = {};
  
  categories.forEach(cat => {
    categoryMap[cat.name.toLowerCase()] = cat;
  });
  
  collections.forEach(col => {
    collectionMap[col.name.toLowerCase()] = col;
  });
  
  return { categoryMap, collectionMap };
};

// All remaining products from your list with unique SKUs
const remainingProducts = [
  {
    name: "Maroon Premium Cotton Shirt",
    description: "Men's Maroon Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
    price: 1099,
    discountedPrice: 330,
    skuCode: "BL-SH-013-MAROON-042",
    h1Heading: "Maroon Premium Cotton Shirt",
    specifications: "Premium cotton shirt in elegant maroon",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 35 },
        { size: "M", stock: 35 },
        { size: "L", stock: 35 },
        { size: "XL", stock: 35 },
        { size: "XXL", stock: 35 }
      ],
      marketingDescription: "Men's Maroon Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Classic Spread Collar",
        pocket: "One Chest Pocket with Logo Embroidery",
        occasion: "Formal & Casual Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "maroon_shirt_1"
      }
    ],
    sizes: [
      { size: "S", stock: 35 },
      { size: "M", stock: 35 },
      { size: "L", stock: 35 },
      { size: "XL", stock: 35 },
      { size: "XXL", stock: 35 }
    ],
    colors: ["Maroon"],
    totalStock: 175,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["office", "maroon", "premium", "cotton"],
    collectionName: "office collection",
    categoryName: "Shirts"
  },
  {
    name: "Men's Yellow Premium Cotton Shirt",
    description: "Men's Yellow Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
    price: 1099,
    discountedPrice: 330,
    skuCode: "BL-SH-013-YELLOW-042",
    h1Heading: "Men's Yellow Premium Cotton Shirt",
    specifications: "Premium cotton shirt in bright yellow",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 30 },
        { size: "M", stock: 30 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 30 },
        { size: "XXL", stock: 30 }
      ],
      marketingDescription: "Men's Yellow Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket with Logo Embroidery",
        occasion: "Formal & Casual Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "yellow_shirt_1"
      }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["Yellow"],
    totalStock: 150,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["office", "yellow", "premium", "cotton"],
    collectionName: "office collection",
    categoryName: "Shirts"
  },
  {
    name: "Light Yellow Solid Cotton Shirt",
    description: "Men's Light Yellow Solid Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
    price: 1099,
    discountedPrice: 330,
    skuCode: "BL-SH-013-LIGHT-YELLOW-042",
    h1Heading: "Light Yellow Solid Cotton Shirt",
    specifications: "Premium cotton shirt in light yellow",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 30 },
        { size: "M", stock: 30 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 30 },
        { size: "XXL", stock: 30 }
      ],
      marketingDescription: "Men's Light Yellow Solid Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket with Logo Embroidery",
        occasion: "Formal & Casual Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "light_yellow_shirt_1"
      }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["Light Yellow"],
    totalStock: 150,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["office", "light-yellow", "premium", "cotton"],
    collectionName: "office collection",
    categoryName: "Shirts"
  },
  {
    name: "Men's Brown & Black Checked Cotton Casual Shirt",
    description: "Men's Brown & Black Checked Cotton Casual Shirt with Full Sleeves, Spread Collar & Dual Chest Pockets",
    price: 2399,
    discountedPrice: 350,
    skuCode: "BL-SH-026-BROWN-BLACK-046",
    h1Heading: "Men's Brown & Black Checked Cotton Casual Shirt",
    specifications: "Checked cotton shirt with brown and black pattern",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 30 },
        { size: "M", stock: 30 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 30 },
        { size: "XXL", stock: 30 }
      ],
      marketingDescription: "Men's Brown & Black Checked Cotton Casual Shirt with Full Sleeves, Spread Collar & Dual Chest Pockets",
      technicalSpecs: {
        fabric: "100% Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "Dual Chest Pockets",
        occasion: "Casual"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&h=600&fit=crop",
        public_id: "brown_black_checked_1"
      }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["Brown & Black"],
    totalStock: 150,
    material: "100% Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: true,
    tags: ["checked", "brown", "black", "casual"],
    collectionName: "checked collection",
    categoryName: "Shirts"
  },
  {
    name: "Dark Green Premium Cotton Shirt",
    description: "Men's Dark Green Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
    price: 1099,
    discountedPrice: 330,
    skuCode: "BL-SH-013-DARK-GREEN-042",
    h1Heading: "Dark Green Premium Cotton Shirt",
    specifications: "Premium cotton shirt in dark green",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 30 },
        { size: "M", stock: 30 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 30 },
        { size: "XXL", stock: 30 }
      ],
      marketingDescription: "Men's Dark Green Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket with Logo Embroidery",
        occasion: "Formal & Casual Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "dark_green_shirt_1"
      }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["Dark Green"],
    totalStock: 150,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["office", "dark-green", "premium", "cotton"],
    collectionName: "office collection",
    categoryName: "Shirts"
  },
  {
    name: "Navy Blue Premium Cotton Shirt",
    description: "A classic navy blue shirt crafted from soft, premium cotton for all-day comfort and style. Its tailored fit and minimal design make it a versatile choice for both work and casual wear.",
    price: 1099,
    discountedPrice: 330,
    skuCode: "BL-SH-013-NAVY-042",
    h1Heading: "Navy Blue Premium Cotton Shirt",
    specifications: "Premium cotton shirt in classic navy blue",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 30 },
        { size: "M", stock: 30 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 30 },
        { size: "XXL", stock: 30 }
      ],
      marketingDescription: "A classic navy blue shirt crafted from soft, premium cotton for all-day comfort and style. Its tailored fit and minimal design make it a versatile choice for both work and casual wear.",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket with Logo Embroidery",
        occasion: "Formal & Casual Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "navy_blue_shirt_1"
      }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["Navy Blue"],
    totalStock: 150,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["office", "navy", "premium", "cotton"],
    collectionName: "office collection",
    categoryName: "Shirts"
  },
  {
    name: "Solid Black Premium Cotton Shirt",
    description: "A classic black shirt crafted from premium cotton for a sleek, versatile look. With its tailored fit and clean design, it's perfect for both formal occasions and casual outings.",
    price: 1099,
    discountedPrice: 350,
    skuCode: "BL-SH-013-BLACK-042",
    h1Heading: "Solid Black Premium Cotton Shirt",
    specifications: "Premium cotton shirt in solid black",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 30 },
        { size: "M", stock: 30 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 30 },
        { size: "XXL", stock: 30 }
      ],
      marketingDescription: "A classic black shirt crafted from premium cotton for a sleek, versatile look. With its tailored fit and clean design, it's perfect for both formal occasions and casual outings.",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket with Logo Embroidery",
        occasion: "Formal & Casual Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "solid_black_shirt_1"
      }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["Solid Black"],
    totalStock: 150,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["casual", "black", "premium", "cotton"],
    collectionName: "casual collection",
    categoryName: "Shirts"
  },
  {
    name: "Men's Black Premium Cotton Shirt",
    description: "Men's Black Premium Cotton Shirt with Full Sleeves, Tailored Fit, and Spread Collar",
    price: 1549,
    discountedPrice: 430,
    skuCode: "BL-SH-013-BLACK-PARTY-020",
    h1Heading: "Men's Black Premium Cotton Shirt",
    specifications: "Premium cotton shirt in black for party wear",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 30 },
        { size: "M", stock: 30 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 30 },
        { size: "XXL", stock: 30 }
      ],
      marketingDescription: "Men's Black Premium Cotton Shirt with Full Sleeves, Tailored Fit, and Spread Collar",
      technicalSpecs: {
        fabric: "100% Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket",
        occasion: "Party Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "black_party_shirt_1"
      }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["Black"],
    totalStock: 150,
    material: "100% Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: true,
    isTrending: true,
    tags: ["party", "black", "premium", "cotton"],
    collectionName: "party wear collection",
    categoryName: "Shirts"
  },
  {
    name: "Men's White Polo T-Shirt",
    description: "Men's White Polo T-Shirt with Contrast Collar & Sleeve Branding",
    price: 1599,
    discountedPrice: 250,
    skuCode: "BL-TSH-003-WHITE-0031",
    h1Heading: "Men's White Polo T-Shirt",
    specifications: "Classic polo shirt in white with contrast details",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 45 },
        { size: "M", stock: 45 },
        { size: "L", stock: 45 },
        { size: "XL", stock: 45 },
        { size: "XXL", stock: 45 }
      ],
      marketingDescription: "Men's White Polo T-Shirt with Contrast Collar & Sleeve Branding",
      technicalSpecs: {
        fabric: "100% Cotton",
        sleeves: "Full",
        collar: "Spread Collar",
        pocket: "None",
        occasion: "Casual"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop",
        public_id: "white_polo_1"
      }
    ],
    sizes: [
      { size: "S", stock: 45 },
      { size: "M", stock: 45 },
      { size: "L", stock: 45 },
      { size: "XL", stock: 45 },
      { size: "XXL", stock: 45 }
    ],
    colors: ["White"],
    totalStock: 225,
    material: "100% Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["polo", "white", "casual", "cotton"],
    collectionName: "polos",
    categoryName: "Polos"
  },
  {
    name: "Men's Black Polo T-Shirt",
    description: "Men's Black Polo T-Shirt with Contrast Collar & Sleeve Branding",
    price: 1449,
    discountedPrice: 250,
    skuCode: "BL-TSH-003-BLACK-032",
    h1Heading: "Men's Black Polo T-Shirt",
    specifications: "Classic polo shirt in black with contrast details",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 40 },
        { size: "M", stock: 40 },
        { size: "L", stock: 40 },
        { size: "XL", stock: 40 },
        { size: "XXL", stock: 40 }
      ],
      marketingDescription: "Men's Black Polo T-Shirt with Contrast Collar & Sleeve Branding",
      technicalSpecs: {
        fabric: "100% Cotton",
        sleeves: "Full",
        collar: "Spread Collar",
        pocket: "None",
        occasion: "Casual"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop",
        public_id: "black_polo_1"
      }
    ],
    sizes: [
      { size: "S", stock: 40 },
      { size: "M", stock: 40 },
      { size: "L", stock: 40 },
      { size: "XL", stock: 40 },
      { size: "XXL", stock: 40 }
    ],
    colors: ["Black"],
    totalStock: 200,
    material: "100% Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["polo", "black", "casual", "cotton"],
    collectionName: "polos",
    categoryName: "Polos"
  },
  {
    name: "Men's Sky Blue Polo T-Shirt",
    description: "Men's Sky Blue Polo T-Shirt with Contrast Collar & Sleeve Branding",
    price: 1599,
    discountedPrice: 250,
    skuCode: "BL-TSH-003-SKY-BLUE-0031",
    h1Heading: "Men's Sky Blue Polo T-Shirt",
    specifications: "Classic polo shirt in sky blue with contrast details",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 40 },
        { size: "M", stock: 40 },
        { size: "L", stock: 40 },
        { size: "XL", stock: 40 },
        { size: "XXL", stock: 40 }
      ],
      marketingDescription: "Men's Sky Blue Polo T-Shirt with Contrast Collar & Sleeve Branding",
      technicalSpecs: {
        fabric: "100% Cotton",
        sleeves: "Full",
        collar: "Spread Collar",
        pocket: "None",
        occasion: "Casual"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop",
        public_id: "sky_blue_polo_1"
      }
    ],
    sizes: [
      { size: "S", stock: 40 },
      { size: "M", stock: 40 },
      { size: "L", stock: 40 },
      { size: "XL", stock: 40 },
      { size: "XXL", stock: 40 }
    ],
    colors: ["Sky Blue"],
    totalStock: 200,
    material: "100% Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["polo", "sky-blue", "casual", "cotton"],
    collectionName: "polos",
    categoryName: "Polos"
  },
  {
    name: "Deep Blue Relaxed Straight-Fit Denim Jeans",
    description: "Classic deep blue relaxed straight-fit jeans crafted from soft, durable denim. Designed for maximum comfort, everyday wear, and timeless casual style.",
    price: 1999,
    discountedPrice: 650,
    skuCode: "BL-DNM-010-DEEP-BLUE",
    h1Heading: "Deep Blue Relaxed Straight-Fit Denim Jeans",
    specifications: "Relaxed straight-fit denim jeans in deep blue",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 35 },
        { size: "M", stock: 35 },
        { size: "L", stock: 35 },
        { size: "XL", stock: 35 },
        { size: "XXL", stock: 35 }
      ],
      marketingDescription: "Classic deep blue relaxed straight-fit jeans crafted from soft, durable denim. Designed for maximum comfort, everyday wear, and timeless casual style.",
      technicalSpecs: {
        fabric: "Denim",
        sleeves: "Full Length",
        collar: "None",
        pocket: "Multiple utility pockets",
        occasion: "Casual"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop",
        public_id: "deep_blue_denim_1"
      }
    ],
    sizes: [
      { size: "S", stock: 35 },
      { size: "M", stock: 35 },
      { size: "L", stock: 35 },
      { size: "XL", stock: 35 },
      { size: "XXL", stock: 35 }
    ],
    colors: ["Deep Blue"],
    totalStock: 175,
    material: "Denim",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["denim", "jeans", "deep-blue", "relaxed-fit"],
    collectionName: "denim",
    categoryName: "Denim"
  },
  {
    name: "Mid-Wash Straight-Fit Classic Denim Jeans",
    description: "Comfortable mid-wash straight-fit jeans crafted from soft, durable denim.",
    price: 1949,
    discountedPrice: 650,
    skuCode: "BL-DNM-008-MID-WASH",
    h1Heading: "Mid-Wash Straight-Fit Classic Denim Jeans",
    specifications: "Straight-fit denim jeans in mid-wash",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 35 },
        { size: "M", stock: 35 },
        { size: "L", stock: 35 },
        { size: "XL", stock: 35 },
        { size: "XXL", stock: 35 }
      ],
      marketingDescription: "Comfortable mid-wash straight-fit jeans crafted from soft, durable denim.",
      technicalSpecs: {
        fabric: "Denim",
        sleeves: "Full Length",
        collar: "None",
        pocket: "Multiple utility pockets",
        occasion: "Casual"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop",
        public_id: "mid_wash_denim_1"
      }
    ],
    sizes: [
      { size: "S", stock: 35 },
      { size: "M", stock: 35 },
      { size: "L", stock: 35 },
      { size: "XL", stock: 35 },
      { size: "XXL", stock: 35 }
    ],
    colors: ["Mid-Wash"],
    totalStock: 175,
    material: "Denim",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["denim", "jeans", "mid-wash", "straight-fit"],
    collectionName: "denim",
    categoryName: "Denim"
  },
  {
    name: "Dark Blue Slim-Fit Stretch Denim Jeans",
    description: "Premium dark blue slim-fit jeans made with soft stretch denim for a sharp, modern silhouette and all-day comfort.",
    price: 2499,
    discountedPrice: 650,
    skuCode: "BL-DNM-012-DARK-BLUE-57",
    h1Heading: "Dark Blue Slim-Fit Stretch Denim Jeans",
    specifications: "Slim-fit stretch denim jeans in dark blue",
    productSpecs: {
      fit: "Slim Fit",
      availableSizes: [
        { size: "S", stock: 30 },
        { size: "M", stock: 30 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 30 },
        { size: "XXL", stock: 30 }
      ],
      marketingDescription: "Premium dark blue slim-fit jeans made with soft stretch denim for a sharp, modern silhouette and all-day comfort.",
      technicalSpecs: {
        fabric: "Stretch Denim",
        sleeves: "Full Length",
        collar: "None",
        pocket: "Multiple utility pockets",
        occasion: "Casual"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop",
        public_id: "dark_blue_slim_denim_1"
      }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["Dark Blue"],
    totalStock: 150,
    material: "Stretch Denim",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: true,
    isTrending: true,
    tags: ["denim", "jeans", "dark-blue", "slim-fit"],
    collectionName: "denim",
    categoryName: "Denim"
  }
];

// Import function
const importRemainingProducts = async () => {
  try {
    console.log('🚀 Starting remaining products import...');

    // Get existing data
    const { categoryMap, collectionMap } = await getExistingData();

    // Import products
    console.log('📦 Importing remaining products...');
    let importedCount = 0;
    
    for (const productData of remainingProducts) {
      try {
        // Find the category and collection for this product
        const categoryKey = productData.categoryName.toLowerCase();
        const collectionKey = productData.collectionName.toLowerCase();
        
        const category = categoryMap[categoryKey];
        const collection = collectionMap[collectionKey];
        
        if (!category) {
          console.warn(`⚠️  Category not found: ${productData.categoryName}`);
          continue;
        }
        
        if (!collection) {
          console.warn(`⚠️  Collection not found: ${productData.collectionName}`);
          continue;
        }

        // Check if product with this SKU already exists
        const existingProduct = await Product.findOne({ skuCode: productData.skuCode });
        if (existingProduct) {
          console.warn(`⚠️  Product with SKU ${productData.skuCode} already exists, skipping...`);
          continue;
        }

        // Create product with category and collection references
        const product = new Product({
          ...productData,
          category: category._id,
          collection: collection._id
        });

        const savedProduct = await product.save();
        importedCount++;
        console.log(`✅ Imported product: ${productData.name} (${importedCount}/${remainingProducts.length})`);
        
      } catch (error) {
        console.error(`❌ Error importing product ${productData.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Import completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   - Products imported: ${importedCount}`);
    console.log(`   - Total products in database: ${await Product.countDocuments()}`);
    console.log(`   - Total categories in database: ${await Category.countDocuments()}`);
    console.log(`   - Total collections in database: ${await Collection.countDocuments()}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
};

// Run the import
importRemainingProducts();
