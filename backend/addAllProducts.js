// Script to add all 50+ products to the database
import mongoose from 'mongoose';
import Product from './models/Product.js';
import Category from './models/Category.js';

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/blacklocust');

// All products data
const products = [
  {
    name: "Men's Slim-Fit Blue Plaid Casual Shirt",
    sku: "BL-SH-013-W/O-042",
    category: "checked collection",
    price: 1099,
    originalPrice: 350,
    description: "Upgrade your everyday wardrobe with this Men's Slim-Fit Blue Plaid Casual Shirt, designed",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBQcm9kdWN0cy83NQ"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1099 },
      { name: "M", stock: 50, price: 1099 },
      { name: "L", stock: 50, price: 1099 },
      { name: "XL", stock: 50, price: 1099 },
      { name: "XXL", stock: 50, price: 1099 }
    ],
    colors: ["Blue Plaid"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Fabric: 100% Cotton",
      "Fit: Tailored Fit",
      "Sleeves: Full",
      "Collar: Spread Collar",
      "Pocket: One with logo embroidery",
      "Occasion: Formal & Casual"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Grey Pinstripe Cotton Shirt",
    sku: "BL-SH-013",
    category: "office collection",
    price: 1549,
    originalPrice: 330,
    description: "A sleek, premium cotton shirt featuring subtle white pinstripes for a refined look. Soft, breathable, and perfectly tailored",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8x"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1549 },
      { name: "M", stock: 50, price: 1549 },
      { name: "L", stock: 50, price: 1549 },
      { name: "XL", stock: 50, price: 1549 },
      { name: "XXL", stock: 50, price: 1549 }
    ],
    colors: ["Grey with White Pinstripes"],
    material: "100% Premium Cotton",
    fit: "Tailored Fit",
    features: [
      "Color: Grey with White Pinstripes",
      "Fabric: 100% Premium Cotton",
      "Fit: Tailored Fit",
      "Sleeves: Full",
      "Collar: Classic Spread Collar",
      "Pocket: One chest pocket with embroidered logo",
      "Pattern: Vertical Pinstripes",
      "Occasion: Formal & Smart Casual"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Teal Blue Premium Cotton Shirt",
    sku: "BL-SH-013-W/O-042",
    category: "party wear collection",
    price: 1599,
    originalPrice: 330,
    description: "Men's Teal Blue Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8z"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1599 },
      { name: "M", stock: 50, price: 1599 },
      { name: "L", stock: 50, price: 1599 },
      { name: "XL", stock: 50, price: 1599 },
      { name: "XXL", stock: 50, price: 1599 }
    ],
    colors: ["Teal Blue"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Maroon Premium Cotton Shirt",
    sku: "BL-SH-013-W/O-042",
    category: "office collection",
    price: 1099,
    originalPrice: 330,
    description: "Men's Maroon Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS80"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1099 },
      { name: "M", stock: 50, price: 1099 },
      { name: "L", stock: 50, price: 1099 },
      { name: "XL", stock: 50, price: 1099 },
      { name: "XXL", stock: 50, price: 1099 }
    ],
    colors: ["Maroon"],
    material: "100% Premium Cotton",
    fit: "Tailored Fit",
    features: [
      "Color: Maroon",
      "Fabric: 100% Premium Cotton",
      "Fit: Tailored Fit",
      "Sleeves: Full Sleeves",
      "Collar: Classic Spread Collar",
      "Pocket: One Chest Pocket with Logo Embroidery",
      "Closure: Button Front",
      "Occasion: Formal & Casual Wear"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Yellow Premium Cotton Shirt",
    sku: "BL-SH-013-W/O-042",
    category: "office collection",
    price: 1099,
    originalPrice: 330,
    description: "Men's Yellow Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS81"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1099 },
      { name: "M", stock: 50, price: 1099 },
      { name: "L", stock: 50, price: 1099 },
      { name: "XL", stock: 50, price: 1099 },
      { name: "XXL", stock: 50, price: 1099 }
    ],
    colors: ["Yellow"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Light Yellow Solid Cotton Shirt",
    sku: "BL-SH-013-W/O-042",
    category: "office collection",
    price: 1099,
    originalPrice: 330,
    description: "Men's Yellow Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS82"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1099 },
      { name: "M", stock: 50, price: 1099 },
      { name: "L", stock: 50, price: 1099 },
      { name: "XL", stock: 50, price: 1099 },
      { name: "XXL", stock: 50, price: 1099 }
    ],
    colors: ["Light Yellow"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Brown & Black Checked Cotton Casual Shirt",
    sku: "BL-SH-026-W/O-046",
    category: "checked collection",
    price: 2399,
    originalPrice: 350,
    description: "Men's Brown & Black Checked Cotton Casual Shirt with Full Sleeves, Spread Collar & Dual Chest Pockets",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS83"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2399 },
      { name: "M", stock: 50, price: 2399 },
      { name: "L", stock: 50, price: 2399 },
      { name: "XL", stock: 50, price: 2399 },
      { name: "XXL", stock: 50, price: 2399 }
    ],
    colors: ["Brown & Black"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Dark Green Premium Cotton Shirt",
    sku: "BL-SH-013-W/O-042",
    category: "office collection",
    price: 1099,
    originalPrice: 330,
    description: "Men's Dark Green Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS84"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1099 },
      { name: "M", stock: 50, price: 1099 },
      { name: "L", stock: 50, price: 1099 },
      { name: "XL", stock: 50, price: 1099 },
      { name: "XXL", stock: 50, price: 1099 }
    ],
    colors: ["Dark Green"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Navy Blue Premium Cotton Shirt",
    sku: "BL-SH-013-W/O-042",
    category: "office collection",
    price: 1099,
    originalPrice: 330,
    description: "A classic navy blue shirt crafted from soft, premium cotton for all-day comfort and style. Its tailored fit and minimal design make it a versatile choice for both work and casual wear",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8gOQ"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1099 },
      { name: "M", stock: 50, price: 1099 },
      { name: "L", stock: 50, price: 1099 },
      { name: "XL", stock: 50, price: 1099 },
      { name: "XXL", stock: 50, price: 1099 }
    ],
    colors: ["Navy Blue"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Brown & Black Checked Cotton Casual Shirt",
    sku: "BL-SH-026-W/O-047",
    category: "checked collection",
    price: 2499,
    originalPrice: 350,
    description: "A stylish brown and black checked shirt crafted from soft, breathable cotton. Designed for comfort and versatility, it's perfect for casual outings, weekend wear, or layering during cooler days.",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8xMA"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2499 },
      { name: "M", stock: 50, price: 2499 },
      { name: "L", stock: 50, price: 2499 },
      { name: "XL", stock: 50, price: 2499 },
      { name: "XXL", stock: 50, price: 2499 }
    ],
    colors: ["Brown & Black"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Solid Black Premium Cotton Shirt",
    sku: "BL-SH-013-W/O-042",
    category: "casual collection",
    price: 1099,
    originalPrice: 350,
    description: "A classic black shirt crafted from premium cotton for a sleek, versatile look. With its tailored fit and clean design, it's perfect for both formal occasions and casual outings.",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8xMA"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1099 },
      { name: "M", stock: 50, price: 1099 },
      { name: "L", stock: 50, price: 1099 },
      { name: "XL", stock: 50, price: 1099 },
      { name: "XXL", stock: 50, price: 1099 }
    ],
    colors: ["Solid Black"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Maroon Striped Cotton Casual Shirt",
    sku: "BL-SH-021",
    category: "casual collection",
    price: 2599,
    originalPrice: 350,
    description: "A refined maroon textured shirt designed for style and comfort. Made from soft, breathable cotton with subtle detailing, it's perfect for smart-casual occasions or weekend outings.",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8xMw"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2599 },
      { name: "M", stock: 50, price: 2599 },
      { name: "L", stock: 50, price: 2599 },
      { name: "XL", stock: 50, price: 2599 },
      { name: "XXL", stock: 50, price: 2599 }
    ],
    colors: ["Maroon"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Brown Textured Striped Cotton Casual Shirt",
    sku: "BL-SH-021",
    category: "casual collection",
    price: 2599,
    originalPrice: 350,
    description: "A refined brown striped shirt crafted from soft, breathable cotton for effortless style and comfort. Its subtle texture and classic design make it perfect for casual days or semi-formal occasions.",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8xNA"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2599 },
      { name: "M", stock: 50, price: 2599 },
      { name: "L", stock: 50, price: 2599 },
      { name: "XL", stock: 50, price: 2599 },
      { name: "XXL", stock: 50, price: 2599 }
    ],
    colors: ["Brown"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Peach Premium Cotton Shirt",
    sku: "BL-SH-013-W/O-042",
    category: "office collection",
    price: 1099,
    originalPrice: 330,
    description: "A stylish peach shirt made from soft, premium cotton for unmatched comfort and versatility. With its tailored fit and clean design, it's perfect for both office days and casual outings.",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8xNg"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1099 },
      { name: "M", stock: 50, price: 1099 },
      { name: "L", stock: 50, price: 1099 },
      { name: "XL", stock: 50, price: 1099 },
      { name: "XXL", stock: 50, price: 1099 }
    ],
    colors: ["Peach"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's White Premium Cotton Shirt",
    sku: "BL-SH-013-W/O-042",
    category: "office collection",
    price: 1099,
    originalPrice: 330,
    description: "A timeless white shirt crafted from premium cotton for ultimate comfort and sophistication. Designed with a tailored fit, it's perfect for formal occasions, office wear",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8xNw"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1099 },
      { name: "M", stock: 50, price: 1099 },
      { name: "L", stock: 50, price: 1099 },
      { name: "XL", stock: 50, price: 1099 },
      { name: "XXL", stock: 50, price: 1099 }
    ],
    colors: ["White"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Black Premium Cotton Shirt",
    sku: "BL-SH-013-W/O-020",
    category: "party wear collection",
    price: 1549,
    originalPrice: 430,
    description: "Men's Black Premium Cotton Shirt with Full Sleeves, Tailored Fit, and Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8xOA"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1549 },
      { name: "M", stock: 50, price: 1549 },
      { name: "L", stock: 50, price: 1549 },
      { name: "XL", stock: 50, price: 1549 },
      { name: "XXL", stock: 50, price: 1549 }
    ],
    colors: ["Black"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's White Striped Cotton Shirt",
    sku: "BL-SH-021",
    category: "office collection",
    price: 2599,
    originalPrice: 430,
    description: "Men's White Striped Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8xOQ"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2599 },
      { name: "M", stock: 50, price: 2599 },
      { name: "L", stock: 50, price: 2599 },
      { name: "XL", stock: 50, price: 2599 },
      { name: "XXL", stock: 50, price: 2599 }
    ],
    colors: ["White"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Grey Premium Cotton Shirt",
    sku: "BL-SH-013-W/O-020",
    category: "party wear collection",
    price: 1549,
    originalPrice: 430,
    description: "Men's Grey Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8yMA"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1549 },
      { name: "M", stock: 50, price: 1549 },
      { name: "L", stock: 50, price: 1549 },
      { name: "XL", stock: 50, price: 1549 },
      { name: "XXL", stock: 50, price: 1549 }
    ],
    colors: ["Grey"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's white Premium Cotton Shirt",
    sku: "BL-SH-013-W/O-020",
    category: "office collection",
    price: 1549,
    originalPrice: 430,
    description: "Men's White Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8yMQ"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1549 },
      { name: "M", stock: 50, price: 1549 },
      { name: "L", stock: 50, price: 1549 },
      { name: "XL", stock: 50, price: 1549 },
      { name: "XXL", stock: 50, price: 1549 }
    ],
    colors: ["white"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Grey & White Striped Cotton Shirt",
    sku: "BL-SH-014",
    category: "office collection",
    price: 1999,
    originalPrice: 330,
    description: "Men's Grey & White Striped Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8yMg"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1999 },
      { name: "M", stock: 50, price: 1999 },
      { name: "L", stock: 50, price: 1999 },
      { name: "XL", stock: 50, price: 1999 },
      { name: "XXL", stock: 50, price: 1999 }
    ],
    colors: ["Grey & White"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Maroon Premium Cotton Shirt",
    sku: "BL-SH-013-W/O-020",
    category: "party wear collection",
    price: 2599,
    originalPrice: 430,
    description: "Men's Maroon Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8yMw"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2599 },
      { name: "M", stock: 50, price: 2599 },
      { name: "L", stock: 50, price: 2599 },
      { name: "XL", stock: 50, price: 2599 },
      { name: "XXL", stock: 50, price: 2599 }
    ],
    colors: ["Maroon"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Sky Blue Premium Cotton Shirt",
    sku: "BL-SH-019",
    category: "office collection",
    price: 1999,
    originalPrice: 330,
    description: "Men's Sky Blue Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8yNA"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1999 },
      { name: "M", stock: 50, price: 1999 },
      { name: "L", stock: 50, price: 1999 },
      { name: "XL", stock: 50, price: 1999 },
      { name: "XXL", stock: 50, price: 1999 }
    ],
    colors: ["Sky Blue"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Light Blue Striped Cotton Shirt",
    sku: "BL-SH-015",
    category: "office collection",
    price: 1949,
    originalPrice: 330,
    description: "Men's Light Blue Striped Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8yNQ"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1949 },
      { name: "M", stock: 50, price: 1949 },
      { name: "L", stock: 50, price: 1949 },
      { name: "XL", stock: 50, price: 1949 },
      { name: "XXL", stock: 50, price: 1949 }
    ],
    colors: ["Light Blue"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's White Pinstriped Cotton",
    sku: "BL-SH-015",
    category: "office collection",
    price: 1949,
    originalPrice: 330,
    description: "Men's White Pinstriped Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8yNg"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1949 },
      { name: "M", stock: 50, price: 1949 },
      { name: "L", stock: 50, price: 1949 },
      { name: "XL", stock: 50, price: 1949 },
      { name: "XXL", stock: 50, price: 1949 }
    ],
    colors: ["White"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's White Textured Cotton Shirt",
    sku: "BL-SH-019",
    category: "office collection",
    price: 1999,
    originalPrice: 330,
    description: "Men's White Textured Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8yNw"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1999 },
      { name: "M", stock: 50, price: 1999 },
      { name: "L", stock: 50, price: 1999 },
      { name: "XL", stock: 50, price: 1999 },
      { name: "XXL", stock: 50, price: 1999 }
    ],
    colors: ["White"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Light Pink Premium Cotton Shirt",
    sku: "BL-SH-019",
    category: "office collection",
    price: 1999,
    originalPrice: 330,
    description: "Men's Light Pink Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8yOA"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1999 },
      { name: "M", stock: 50, price: 1999 },
      { name: "L", stock: 50, price: 1999 },
      { name: "XL", stock: 50, price: 1999 },
      { name: "XXL", stock: 50, price: 1999 }
    ],
    colors: ["Light Pink"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's White Premium Cotton Shirt",
    sku: "BL-SH-013-W/O-042",
    category: "office collection",
    price: 1099,
    originalPrice: 330,
    description: "Men's White Premium Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8yOQ"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1099 },
      { name: "M", stock: 50, price: 1099 },
      { name: "L", stock: 50, price: 1099 },
      { name: "XL", stock: 50, price: 1099 },
      { name: "XXL", stock: 50, price: 1099 }
    ],
    colors: ["White"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Black Textured Striped Cotton Casual Shirt",
    sku: "BL-SH-021",
    category: "casual collection",
    price: 2599,
    originalPrice: 330,
    description: "A sleek black textured striped shirt crafted from premium cotton for a perfect blend of comfort and style. Ideal for both casual gatherings and semi-formal occasions",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8zMA"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2599 },
      { name: "M", stock: 50, price: 2599 },
      { name: "L", stock: 50, price: 2599 },
      { name: "XL", stock: 50, price: 2599 },
      { name: "XXL", stock: 50, price: 2599 }
    ],
    colors: ["Black"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Black & White Checked Cotton Casual Shirt",
    sku: "BL-SH-013W/O-041",
    category: "checked collection",
    price: 1999,
    originalPrice: 350,
    description: "A classic black and white checked shirt crafted from soft, breathable cotton. Designed for everyday comfort and versatile styling",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8zMQ"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1999 },
      { name: "M", stock: 50, price: 1999 },
      { name: "L", stock: 50, price: 1999 },
      { name: "XL", stock: 50, price: 1999 },
      { name: "XXL", stock: 50, price: 1999 }
    ],
    colors: ["Black & White"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Black & White Checked Cotton Casual Shirt",
    sku: "BL-SH-026-W/O-046",
    category: "checked collection",
    price: 2399,
    originalPrice: 350,
    description: "A stylish black and white checked shirt made from soft, breathable cotton. Designed for comfort and everyday versatility, it's perfect for casual outings or layering in cooler weather.",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8zMQ"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2399 },
      { name: "M", stock: 50, price: 2399 },
      { name: "L", stock: 50, price: 2399 },
      { name: "XL", stock: 50, price: 2399 },
      { name: "XXL", stock: 50, price: 2399 }
    ],
    colors: ["Black & White"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's White & Black Checked Cotton Casual Shirt",
    sku: "BL-SH-026-W/O-047",
    category: "checked collection",
    price: 2499,
    originalPrice: 350,
    description: "This white and black checked cotton shirt offers effortless style and everyday comfort. Perfect for casual wear, it pairs easily with jeans or chinos for a clean, versatile look.",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8zMg"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2499 },
      { name: "M", stock: 50, price: 2499 },
      { name: "L", stock: 50, price: 2499 },
      { name: "XL", stock: 50, price: 2499 },
      { name: "XXL", stock: 50, price: 2499 }
    ],
    colors: ["White & Black"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Light Grey Checked Cotton Casual Shirt",
    sku: "BL-SH-026-W/O-047",
    category: "checked collection",
    price: 2499,
    originalPrice: 350,
    description: "A subtle and stylish light grey checked shirt crafted from soft, breathable cotton. Its clean design and relaxed fit make it perfect for casual outings, weekend wear, or everyday comfort.",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8zMw"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2499 },
      { name: "M", stock: 50, price: 2499 },
      { name: "L", stock: 50, price: 2499 },
      { name: "XL", stock: 50, price: 2499 },
      { name: "XXL", stock: 50, price: 2499 }
    ],
    colors: ["Light Grey"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Blue & Brown Checked Cotton Casual linen Shirt",
    sku: "BL-SH-026-W/O-047",
    category: "checked collection",
    price: 2499,
    originalPrice: 350,
    description: "A stylish blue and brown checked shirt crafted from premium cotton for comfort and durability. Its bold check pattern and soft fabric",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8zNA"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2499 },
      { name: "M", stock: 50, price: 2499 },
      { name: "L", stock: 50, price: 2499 },
      { name: "XL", stock: 50, price: 2499 },
      { name: "XXL", stock: 50, price: 2499 }
    ],
    colors: ["Blue & Brown"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Cream & Green Checked Cotton Casual linen Shirt",
    sku: "BL-SH-026-W/O-047",
    category: "checked collection",
    price: 2499,
    originalPrice: 350,
    description: "A refreshing cream and green checked cotton shirt designed for all-day comfort and effortless style",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8zNQ"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2499 },
      { name: "M", stock: 50, price: 2499 },
      { name: "L", stock: 50, price: 2499 },
      { name: "XL", stock: 50, price: 2499 },
      { name: "XXL", stock: 50, price: 2499 }
    ],
    colors: ["Cream & Green"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Blue Checked Cotton Casual linen Shirt",
    sku: "BL-SH-026-W/O-047",
    category: "checked collection",
    price: 2499,
    originalPrice: 350,
    description: "A stylish blue checked shirt crafted from soft, breathable cotton. Its modern check pattern and comfortable fit make it perfect for casual outings",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8zNg"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2499 },
      { name: "M", stock: 50, price: 2499 },
      { name: "L", stock: 50, price: 2499 },
      { name: "XL", stock: 50, price: 2499 },
      { name: "XXL", stock: 50, price: 2499 }
    ],
    colors: ["Blue"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Brown & Red Checked Cotton Casual linen Shirt",
    sku: "BL-SH-026-W/O-047",
    category: "checked collection",
    price: 2499,
    originalPrice: 350,
    description: "A bold brown and red checked shirt crafted from soft, breathable cotton. Designed for comfort and effortless style, it's the perfect pick for casual outings",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8zNw"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2499 },
      { name: "M", stock: 50, price: 2499 },
      { name: "L", stock: 50, price: 2499 },
      { name: "XL", stock: 50, price: 2499 },
      { name: "XXL", stock: 50, price: 2499 }
    ],
    colors: ["Brown & Red"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Black & Grey Checked Cotton Casual linen Shirt",
    sku: "BL-SH-026-W/O-047",
    category: "checked collection",
    price: 2499,
    originalPrice: 350,
    description: "A versatile black and grey checked shirt made from soft, breathable cotton for everyday comfort. Its bold pattern and classic design make it a perfect choice for casual outings or relaxed office wear.",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8zOA"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2499 },
      { name: "M", stock: 50, price: 2499 },
      { name: "L", stock: 50, price: 2499 },
      { name: "XL", stock: 50, price: 2499 },
      { name: "XXL", stock: 50, price: 2499 }
    ],
    colors: ["Black & Grey"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Brown & Beige Checked Cotton Casual Shirt with Full Sleeves",
    sku: "BL-SH-026-W/O-047",
    category: "checked collection",
    price: 2499,
    originalPrice: 350,
    description: "A warm-toned brown and beige checked shirt that brings comfort and style together. Crafted from soft, breathable cotton, it's perfect for layering or wearing solo during casual outings and cooler days.",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8zOQ"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2499 },
      { name: "M", stock: 50, price: 2499 },
      { name: "L", stock: 50, price: 2499 },
      { name: "XL", stock: 50, price: 2499 },
      { name: "XXL", stock: 50, price: 2499 }
    ],
    colors: ["Brown & Beige"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Maroon & Navy Checked Cotton Casual Shirt",
    sku: "BL-SH-026-W/O-047",
    category: "checked collection",
    price: 2499,
    originalPrice: 350,
    description: "A classic maroon and navy checked shirt that blends timeless style with everyday comfort. Perfect for casual outings or weekend wear, it adds a touch of effortless charm to your wardrobe",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS80MA"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2499 },
      { name: "M", stock: 50, price: 2499 },
      { name: "L", stock: 50, price: 2499 },
      { name: "XL", stock: 50, price: 2499 },
      { name: "XXL", stock: 50, price: 2499 }
    ],
    colors: ["Maroon & Navy"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Teal Blue & Brown Checked Cotton Casual Shirt",
    sku: "BL-SH-026-W/O-047",
    category: "checked collection",
    price: 2499,
    originalPrice: 350,
    description: "A stylish teal and brown checked shirt that combines modern flair with classic comfort. Perfect for casual outings or semi-formal occasions, offering a relaxed yet refined look.",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS80MA"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2499 },
      { name: "M", stock: 50, price: 2499 },
      { name: "L", stock: 50, price: 2499 },
      { name: "XL", stock: 50, price: 2499 },
      { name: "XXL", stock: 50, price: 2499 }
    ],
    colors: ["Teal Blue & Brown"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Beige Checked Cotton Shirt",
    sku: "BL-SH-026-W/O-047",
    category: "checked collection",
    price: 2499,
    originalPrice: 350,
    description: "Men's Beige Checked Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS80MQ"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2499 },
      { name: "M", stock: 50, price: 2499 },
      { name: "L", stock: 50, price: 2499 },
      { name: "XL", stock: 50, price: 2499 },
      { name: "XXL", stock: 50, price: 2499 }
    ],
    colors: ["Beige"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Brown & Cream Checked",
    sku: "BL-SH-026-W/O-047",
    category: "checked collection",
    price: 2499,
    originalPrice: 350,
    description: "Men's Brown & Cream Checked Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS80Mg"
    ],
    sizes: [
      { name: "S", stock: 50, price: 2499 },
      { name: "M", stock: 50, price: 2499 },
      { name: "L", stock: 50, price: 2499 },
      { name: "XL", stock: 50, price: 2499 },
      { name: "XXL", stock: 50, price: 2499 }
    ],
    colors: ["Brown & Cream"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Striped formal shirt",
    sku: "BL-SH-6621-W/O-071",
    category: "New collection",
    price: 1799,
    originalPrice: 350,
    description: "Men's Sage Green & White Striped Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS80Mw"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1799 },
      { name: "M", stock: 50, price: 1799 },
      { name: "L", stock: 50, price: 1799 },
      { name: "XL", stock: 50, price: 1799 },
      { name: "XXL", stock: 50, price: 1799 }
    ],
    colors: ["Sage Green & White"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Classic Spread Collar",
      "Striped 100% Cotton Casual Shirt – Regular Fit"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Striped formal shirt",
    sku: "BL-SH-6621-W/O-071",
    category: "New collection",
    price: 1799,
    originalPrice: 350,
    description: "Men's Red & White Striped Cotton Casual Shirt with Full Sleeves,  Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS80NA"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1799 },
      { name: "M", stock: 50, price: 1799 },
      { name: "L", stock: 50, price: 1799 },
      { name: "XL", stock: 50, price: 1799 },
      { name: "XXL", stock: 50, price: 1799 }
    ],
    colors: ["Red & White"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Classic Spread Collar",
      "Striped 100% Cotton Casual Shirt – Regular Fit"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Striped formal shirt",
    sku: "BL-SH-6621-W/O-071",
    category: "New collection",
    price: 1799,
    originalPrice: 350,
    description: "Men's Beige & White Striped Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      ""
    ],
    sizes: [
      { name: "S", stock: 50, price: 1799 },
      { name: "M", stock: 50, price: 1799 },
      { name: "L", stock: 50, price: 1799 },
      { name: "XL", stock: 50, price: 1799 },
      { name: "XXL", stock: 50, price: 1799 }
    ],
    colors: ["Beige & White"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Classic Spread Collar",
      "Striped 100% Cotton Casual Shirt – Regular Fit"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Striped formal shirt",
    sku: "BL-SH-6621-W/O-071",
    category: "New collection",
    price: 1799,
    originalPrice: 350,
    description: "Men's Sky Blue & White Striped Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS80NQ"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1799 },
      { name: "M", stock: 50, price: 1799 },
      { name: "L", stock: 50, price: 1799 },
      { name: "XL", stock: 50, price: 1799 },
      { name: "XXL", stock: 50, price: 1799 }
    ],
    colors: ["Sky Blue & White"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Classic Spread Collar",
      "Striped 100% Cotton Casual Shirt – Regular Fit"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Striped formal shirt",
    sku: "BL-SH-6621-W/O-071",
    category: "New collection",
    price: 1799,
    originalPrice: 350,
    description: "Men's Aqua Blue & White Striped Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS80Ng"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1799 },
      { name: "M", stock: 50, price: 1799 },
      { name: "L", stock: 50, price: 1799 },
      { name: "XL", stock: 50, price: 1799 },
      { name: "XXL", stock: 50, price: 1799 }
    ],
    colors: ["Aqua Blue & White"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Classic Spread Collar",
      "Striped 100% Cotton Casual Shirt – Regular Fit"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Striped formal shirt",
    sku: "BL-SH-6621-W/O-071",
    category: "New collection",
    price: 1799,
    originalPrice: 350,
    description: "Men's Grey & White Striped Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS80Nw"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1799 },
      { name: "M", stock: 50, price: 1799 },
      { name: "L", stock: 50, price: 1799 },
      { name: "XL", stock: 50, price: 1799 },
      { name: "XXL", stock: 50, price: 1799 }
    ],
    colors: ["Grey & White"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Classic Spread Collar",
      "Striped 100% Cotton Casual Shirt – Regular Fit"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Striped formal shirt",
    sku: "BL-SH-6621-W/O-071",
    category: "New collection",
    price: 1799,
    originalPrice: 350,
    description: "Men's Yellow & White Striped Cotton Shirt with Full Sleeves, Tailored Fit & Spread Collar",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS80OA"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1799 },
      { name: "M", stock: 50, price: 1799 },
      { name: "L", stock: 50, price: 1799 },
      { name: "XL", stock: 50, price: 1799 },
      { name: "XXL", stock: 50, price: 1799 }
    ],
    colors: ["Yellow & White"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Classic Spread Collar",
      "Striped 100% Cotton Casual Shirt – Regular Fit"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Navy & Grey Checked Cotton Overshirt Jacket",
    sku: "BL-JK-029-W/O-052",
    category: "Winter Collection",
    price: 1949,
    originalPrice: 950,
    description: "A versatile overshirt jacket that blends warmth and effortless style. Perfect for layering during cool days, featuring a modern checked pattern for a timeless appeal.",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS80OQ"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1949 },
      { name: "M", stock: 50, price: 1949 },
      { name: "L", stock: 50, price: 1949 },
      { name: "XL", stock: 50, price: 1949 },
      { name: "XXL", stock: 50, price: 1949 }
    ],
    colors: ["Navy & Grey"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Beige & Grey Checked Cotton Overshirt Jacket",
    sku: "BL-JK-028-W/O-051",
    category: "Winter Collection",
    price: 1949,
    originalPrice: 950,
    description: "A stylish beige and grey checked overshirt jacket that blends comfort with versatility — perfect for layering through the season.",
    brand: "Black Locust",
    images: [
      "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS81MA"
    ],
    sizes: [
      { name: "S", stock: 50, price: 1949 },
      { name: "M", stock: 50, price: 1949 },
      { name: "L", stock: 50, price: 1949 },
      { name: "XL", stock: 50, price: 1949 },
      { name: "XXL", stock: 50, price: 1949 }
    ],
    colors: ["Beige & Grey"],
    material: "100% Cotton",
    fit: "Regular fit",
    features: [
      "Brand Fit Name: Classic",
      "Collar: Spread Collar",
      "Placket: Button Placket",
      "Placket Length: Full",
      "Length: Long Sleeves"
    ],
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  }
];

// Function to add all products
async function addAllProducts() {
  try {
    console.log('🚀 Starting to add all products...');
    
    // Clear existing products first
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');
    
    // Add all new products
    const addedProducts = await Product.insertMany(products);
    console.log(`✅ Successfully added ${addedProducts.length} products`);
    
    // Display summary by collection
    const summary = {};
    products.forEach(product => {
      const collection = product.category;
      if (!summary[collection]) {
        summary[collection] = 0;
      }
      summary[collection]++;
    });
    
    console.log('\n📊 Products Summary by Collection:');
    Object.keys(summary).forEach(collection => {
      console.log(`  ${collection}: ${summary[collection]} products`);
    });
    
    console.log('\n🎉 All products have been added successfully!');
    console.log('📱 You can now view all products in the frontend');
    console.log('🔗 Visit: http://localhost:3000/products');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding products:', error);
    process.exit(1);
  }
}

// Run the function
addAllProducts();
