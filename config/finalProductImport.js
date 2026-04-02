import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Collection from '../models/Collection.js';
import Category from '../models/Category.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blacklocust')
  .then(() => console.log('✅ MongoDB Connected for final product import'))
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

// Final batch of products from your list
const finalProducts = [
  {
    name: "Grey Premium Cotton Shirt",
    description: "Men's Grey Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    price: 1549,
    discountedPrice: 430,
    skuCode: "BL-SH-013-GREY-PARTY-020",
    h1Heading: "Grey Premium Cotton Shirt",
    specifications: "Premium cotton shirt in grey for party wear",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 25 },
        { size: "M", stock: 25 },
        { size: "L", stock: 25 },
        { size: "XL", stock: 25 },
        { size: "XXL", stock: 25 }
      ],
      marketingDescription: "Men's Grey Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket",
        occasion: "Party Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "grey_party_shirt_1"
      }
    ],
    sizes: [
      { size: "S", stock: 25 },
      { size: "M", stock: 25 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 25 },
      { size: "XXL", stock: 25 }
    ],
    colors: ["Grey"],
    totalStock: 125,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: true,
    isTrending: true,
    tags: ["party", "grey", "premium", "cotton"],
    collectionName: "party wear collection",
    categoryName: "Shirts"
  },
  {
    name: "Men's White Premium Cotton Shirt",
    description: "Men's White Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    price: 1549,
    discountedPrice: 430,
    skuCode: "BL-SH-013-WHITE-PARTY-020",
    h1Heading: "Men's White Premium Cotton Shirt",
    specifications: "Premium cotton shirt in white for party wear",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 25 },
        { size: "M", stock: 25 },
        { size: "L", stock: 25 },
        { size: "XL", stock: 25 },
        { size: "XXL", stock: 25 }
      ],
      marketingDescription: "Men's White Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket",
        occasion: "Party Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "white_party_shirt_1"
      }
    ],
    sizes: [
      { size: "S", stock: 25 },
      { size: "M", stock: 25 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 25 },
      { size: "XXL", stock: 25 }
    ],
    colors: ["White"],
    totalStock: 125,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: true,
    isTrending: true,
    tags: ["party", "white", "premium", "cotton"],
    collectionName: "party wear collection",
    categoryName: "Shirts"
  },
  {
    name: "Grey & White Striped Cotton Shirt",
    description: "Men's Grey & White Striped Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    price: 1999,
    discountedPrice: 330,
    skuCode: "BL-SH-014-GREY-WHITE",
    h1Heading: "Grey & White Striped Cotton Shirt",
    specifications: "Office shirt with grey and white stripes",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 30 },
        { size: "M", stock: 30 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 30 },
        { size: "XXL", stock: 30 }
      ],
      marketingDescription: "Men's Grey & White Striped Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket",
        occasion: "Office Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "grey_white_striped_1"
      }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["Grey & White"],
    totalStock: 150,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["office", "striped", "grey-white", "cotton"],
    collectionName: "office collection",
    categoryName: "Shirts"
  },
  {
    name: "Maroon Premium Cotton Shirt",
    description: "Men's Maroon Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    price: 2599,
    discountedPrice: 430,
    skuCode: "BL-SH-021-MAROON",
    h1Heading: "Maroon Premium Cotton Shirt",
    specifications: "Casual shirt in maroon with stripes",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 25 },
        { size: "M", stock: 25 },
        { size: "L", stock: 25 },
        { size: "XL", stock: 25 },
        { size: "XXL", stock: 25 }
      ],
      marketingDescription: "Men's Maroon Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket",
        occasion: "Casual Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "maroon_casual_shirt_1"
      }
    ],
    sizes: [
      { size: "S", stock: 25 },
      { size: "M", stock: 25 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 25 },
      { size: "XXL", stock: 25 }
    ],
    colors: ["Maroon"],
    totalStock: 125,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["casual", "maroon", "striped", "cotton"],
    collectionName: "casual collection",
    categoryName: "Shirts"
  },
  {
    name: "Sky Blue Premium Cotton Shirt",
    description: "Men's Sky Blue Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    price: 1999,
    discountedPrice: 330,
    skuCode: "BL-SH-019-SKY-BLUE",
    h1Heading: "Sky Blue Premium Cotton Shirt",
    specifications: "Office shirt in sky blue",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 30 },
        { size: "M", stock: 30 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 30 },
        { size: "XXL", stock: 30 }
      ],
      marketingDescription: "Men's Sky Blue Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket",
        occasion: "Office Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "sky_blue_office_shirt_1"
      }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["Sky Blue"],
    totalStock: 150,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["office", "sky-blue", "premium", "cotton"],
    collectionName: "office collection",
    categoryName: "Shirts"
  },
  {
    name: "Light Blue Striped Cotton Shirt",
    description: "Men's Light Blue Striped Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    price: 1949,
    discountedPrice: 330,
    skuCode: "BL-SH-015-LIGHT-BLUE",
    h1Heading: "Light Blue Striped Cotton Shirt",
    specifications: "Office shirt with light blue stripes",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 30 },
        { size: "M", stock: 30 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 30 },
        { size: "XXL", stock: 30 }
      ],
      marketingDescription: "Men's Light Blue Striped Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket",
        occasion: "Office Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "light_blue_striped_1"
      }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["Light Blue"],
    totalStock: 150,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["office", "light-blue", "striped", "cotton"],
    collectionName: "office collection",
    categoryName: "Shirts"
  },
  {
    name: "White Pinstriped Cotton Shirt",
    description: "Men's White Pinstriped Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    price: 1949,
    discountedPrice: 330,
    skuCode: "BL-SH-015-WHITE-PIN",
    h1Heading: "White Pinstriped Cotton Shirt",
    specifications: "Office shirt with white pinstripes",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 30 },
        { size: "M", stock: 30 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 30 },
        { size: "XXL", stock: 30 }
      ],
      marketingDescription: "Men's White Pinstriped Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket",
        occasion: "Office Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "white_pinstriped_1"
      }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["White"],
    totalStock: 150,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["office", "white", "pinstriped", "cotton"],
    collectionName: "office collection",
    categoryName: "Shirts"
  },
  {
    name: "White Textured Cotton Shirt",
    description: "Men's White Textured Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    price: 1999,
    discountedPrice: 330,
    skuCode: "BL-SH-019-WHITE-TEXT",
    h1Heading: "White Textured Cotton Shirt",
    specifications: "Office shirt with white texture",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 30 },
        { size: "M", stock: 30 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 30 },
        { size: "XXL", stock: 30 }
      ],
      marketingDescription: "Men's White Textured Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket",
        occasion: "Office Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "white_textured_1"
      }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["White"],
    totalStock: 150,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["office", "white", "textured", "cotton"],
    collectionName: "office collection",
    categoryName: "Shirts"
  },
  {
    name: "Light Pink Premium Cotton Shirt",
    description: "Men's Light Pink Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    price: 1999,
    discountedPrice: 330,
    skuCode: "BL-SH-019-LIGHT-PINK",
    h1Heading: "Light Pink Premium Cotton Shirt",
    specifications: "Office shirt in light pink",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 25 },
        { size: "M", stock: 25 },
        { size: "L", stock: 25 },
        { size: "XL", stock: 25 },
        { size: "XXL", stock: 25 }
      ],
      marketingDescription: "Men's Light Pink Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket",
        occasion: "Office Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "light_pink_shirt_1"
      }
    ],
    sizes: [
      { size: "S", stock: 25 },
      { size: "M", stock: 25 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 25 },
      { size: "XXL", stock: 25 }
    ],
    colors: ["Light Pink"],
    totalStock: 125,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["office", "light-pink", "premium", "cotton"],
    collectionName: "office collection",
    categoryName: "Shirts"
  },
  {
    name: "Peach Premium Cotton Shirt",
    description: "Men's Peach Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
    price: 1099,
    discountedPrice: 330,
    skuCode: "BL-SH-013-PEACH-042",
    h1Heading: "Peach Premium Cotton Shirt",
    specifications: "Office shirt in peach color",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 30 },
        { size: "M", stock: 30 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 30 },
        { size: "XXL", stock: 30 }
      ],
      marketingDescription: "Men's Peach Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket",
        occasion: "Office Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "peach_shirt_1"
      }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["Peach"],
    totalStock: 150,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["office", "peach", "premium", "cotton"],
    collectionName: "office collection",
    categoryName: "Shirts"
  },
  {
    name: "Men's White Premium Cotton Shirt",
    description: "Men's White Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    price: 1099,
    discountedPrice: 330,
    skuCode: "BL-SH-013-WHITE-OFFICE-042",
    h1Heading: "Men's White Premium Cotton Shirt",
    specifications: "Office shirt in white",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 30 },
        { size: "M", stock: 30 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 30 },
        { size: "XXL", stock: 30 }
      ],
      marketingDescription: "Men's White Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket",
        occasion: "Office Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "white_office_shirt_1"
      }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["White"],
    totalStock: 150,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["office", "white", "premium", "cotton"],
    collectionName: "office collection",
    categoryName: "Shirts"
  },
  {
    name: "Black Textured Striped Cotton Casual Shirt",
    description: "A sleek black textured striped shirt crafted from premium cotton for a perfect blend of comfort and style. Ideal for both casual gatherings and semi-formal occasions",
    price: 2599,
    discountedPrice: 330,
    skuCode: "BL-SH-021-BLACK-TEXT",
    h1Heading: "Black Textured Striped Cotton Casual Shirt",
    specifications: "Casual shirt with black texture and stripes",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 25 },
        { size: "M", stock: 25 },
        { size: "L", stock: 25 },
        { size: "XL", stock: 25 },
        { size: "XXL", stock: 25 }
      ],
      marketingDescription: "A sleek black textured striped shirt crafted from premium cotton for a perfect blend of comfort and style. Ideal for both casual gatherings and semi-formal occasions",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket",
        occasion: "Casual"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "black_textured_striped_1"
      }
    ],
    sizes: [
      { size: "S", stock: 25 },
      { size: "M", stock: 25 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 25 },
      { size: "XXL", stock: 25 }
    ],
    colors: ["Black"],
    totalStock: 125,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["casual", "black", "textured", "striped"],
    collectionName: "casual collection",
    categoryName: "Shirts"
  },
  {
    name: "Men's Black & White Checked Cotton Casual Shirt",
    description: "A classic black and white checked shirt crafted from soft, breathable cotton. Designed for everyday comfort and versatile styling",
    price: 1999,
    discountedPrice: 350,
    skuCode: "BL-SH-013-BLACK-WHITE-041",
    h1Heading: "Men's Black & White Checked Cotton Casual Shirt",
    specifications: "Checked shirt with black and white pattern",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 30 },
        { size: "M", stock: 30 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 30 },
        { size: "XXL", stock: 30 }
      ],
      marketingDescription: "A classic black and white checked shirt crafted from soft, breathable cotton. Designed for everyday comfort and versatile styling",
      technicalSpecs: {
        fabric: "100% Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket",
        occasion: "Casual"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "black_white_checked_1"
      }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["Black & White"],
    totalStock: 150,
    material: "100% Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["checked", "black-white", "casual", "cotton"],
    collectionName: "checked collection",
    categoryName: "Shirts"
  },
  {
    name: "Men's Brown & Beige Checked Cotton Casual Shirt",
    description: "A warm-toned brown and beige checked shirt that brings comfort and style together. Crafted from soft, breathable cotton, it's perfect for layering or wearing solo during casual outings and cooler days.",
    price: 2499,
    discountedPrice: 350,
    skuCode: "BL-SH-026-BROWN-BEIGE-047",
    h1Heading: "Men's Brown & Beige Checked Cotton Casual Shirt",
    specifications: "Checked shirt with brown and beige pattern",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 25 },
        { size: "M", stock: 25 },
        { size: "L", stock: 25 },
        { size: "XL", stock: 25 },
        { size: "XXL", stock: 25 }
      ],
      marketingDescription: "A warm-toned brown and beige checked shirt that brings comfort and style together. Crafted from soft, breathable cotton, it's perfect for layering or wearing solo during casual outings and cooler days.",
      technicalSpecs: {
        fabric: "100% Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket",
        occasion: "Casual"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "brown_beige_checked_1"
      }
    ],
    sizes: [
      { size: "S", stock: 25 },
      { size: "M", stock: 25 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 25 },
      { size: "XXL", stock: 25 }
    ],
    colors: ["Brown & Beige"],
    totalStock: 125,
    material: "100% Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["checked", "brown-beige", "casual", "cotton"],
    collectionName: "checked collection",
    categoryName: "Shirts"
  },
  {
    name: "Beige Checked Cotton Shirt",
    description: "Men's Beige Checked Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    price: 2499,
    discountedPrice: 350,
    skuCode: "BL-SH-026-BEIGE-047",
    h1Heading: "Beige Checked Cotton Shirt",
    specifications: "Checked shirt in beige color",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 25 },
        { size: "M", stock: 25 },
        { size: "L", stock: 25 },
        { size: "XL", stock: 25 },
        { size: "XXL", stock: 25 }
      ],
      marketingDescription: "Men's Beige Checked Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
      technicalSpecs: {
        fabric: "100% Cotton",
        sleeves: "Full Sleeves",
        collar: "Spread Collar",
        pocket: "One Chest Pocket",
        occasion: "Casual"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "beige_checked_1"
      }
    ],
    sizes: [
      { size: "S", stock: 25 },
      { size: "M", stock: 25 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 25 },
      { size: "XXL", stock: 25 }
    ],
    colors: ["Beige"],
    totalStock: 125,
    material: "100% Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["checked", "beige", "casual", "cotton"],
    collectionName: "checked collection",
    categoryName: "Shirts"
  }
];

// Import function
const importFinalProducts = async () => {
  try {
    console.log('🚀 Starting final products import...');

    // Get existing data
    const { categoryMap, collectionMap } = await getExistingData();

    // Import products
    console.log('📦 Importing final batch of products...');
    let importedCount = 0;
    
    for (const productData of finalProducts) {
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
        console.log(`✅ Imported product: ${productData.name} (${importedCount}/${finalProducts.length})`);
        
      } catch (error) {
        console.error(`❌ Error importing product ${productData.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Final import completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   - Products imported: ${importedCount}`);
    console.log(`   - Total products in database: ${await Product.countDocuments()}`);
    console.log(`   - Total categories in database: ${await Category.countDocuments()}`);
    console.log(`   - Total collections in database: ${await Collection.countDocuments()}`);
    
    console.log(`\n🎯 All products are now organized in their respective collections!`);
    console.log(`📱 You can now test the frontend to see all products displayed correctly.`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
};

// Run the import
importFinalProducts();
