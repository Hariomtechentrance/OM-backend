import mongoose from 'mongoose';
import 'dotenv/config';

// Import models
import Product from './models/Product.js';
import User from './models/userModel.js';
import Collection from './models/Collection.js';
import Category from './models/Category.js';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Clear existing data
    await Product.deleteMany({});
    await Collection.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing products, collections, and categories');

    // 2. Create Collections (13 total)
    const collectionsData = [
      { name: "Wedding Edition", slug: "wedding", image: "https://images.unsplash.com/photo-1594932224828-b4b05a832fe3?w=800&q=80" },
      { name: "Office Essentials", slug: "office", image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&q=80" },
      { name: "Casual Vibe", slug: "casual", image: "https://images.unsplash.com/photo-1516257984877-a03a01ae1b89?w=800&q=80" },
      { name: "Linen Luxe", slug: "linen", image: "https://images.unsplash.com/photo-1523381235200-62947558d447?w=800&q=80" },
      { name: "Party Wear", slug: "party", image: "https://images.unsplash.com/photo-1594633312681-435c7b80c148?w=800&q=80" },
      { name: "Summer Breeze", slug: "summer", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80" },
      { name: "Winter Warmth", slug: "winter", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" },
      { name: "Denim Days", slug: "denim", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80" },
      { name: "Junior Style", slug: "kids-collection", image: "https://images.unsplash.com/photo-1519457431-7571f018272b?w=800&q=80" },
      { name: "Formal Fit", slug: "formal", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" },
      { name: "Checked Charm", slug: "checked", image: "https://images.unsplash.com/photo-1592862902946-75fe5d72046b?w=800&q=80" },
      { name: "Printed Passion", slug: "printed", image: "https://images.unsplash.com/photo-1598533340337-94cc6b233c11?w=800&q=80" },
      { name: "Cargo Comfort", slug: "cargo", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80" }
    ];

    const collections = await Collection.insertMany(collectionsData.map(c => ({
      ...c,
      isActive: true,
      showInNavbar: true,
      showInFeatured: true,
      showOnHome: true,
      collectionType: 'main'
    })));
    console.log('Created 13 collections');

    // 3. Create Categories
    const categoriesData = [
      { name: "Men", slug: "men", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop" },
      { name: "Kids", slug: "kids", image: "https://images.unsplash.com/photo-1519457431-7571f018272b?w=400&h=400&fit=crop" }
    ];
    const categories = await Category.insertMany(categoriesData.map(c => ({ ...c, isActive: true })));
    console.log('Created 2 categories');

    // 4. Create 93 Products
    const products = [];
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const images = [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
      "https://images.unsplash.com/photo-1624371414361-e6e8ea02c1e0?w=800&q=80",
      "https://images.unsplash.com/photo-1594932224828-b4b05a832fe3?w=800&q=80",
      "https://images.unsplash.com/photo-1516257984877-a03a01ae1b89?w=800&q=80",
      "https://images.unsplash.com/photo-1523381235200-62947558d447?w=800&q=80",
      "https://images.unsplash.com/photo-1519457431-7571f018272b?w=800&q=80",
      "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80",
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&q=80",
      "https://images.unsplash.com/photo-1555069519-127a3f177c8d?w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
    ];

    for (let i = 1; i <= 93; i++) {
      const colIndex = i % collections.length;
      const catIndex = i % categories.length;
      const imgIndex = i % images.length;
      const nextImgIndex = (i + 1) % images.length;

      products.push({
        name: `Premium Item ${i}`,
        description: `This is a high-quality description for Premium Item ${i}. Made with the finest materials for comfort and style.`,
        price: 999 + (i * 100),
        mrp: 1999 + (i * 100),
        category: categories[catIndex]._id,
        categoryName: categories[catIndex].name,
        collection: collections[colIndex]._id,
        skuCode: `BL-PROD-${i}`,
        h1Heading: `Premium Item ${i}`,
        specifications: '100% Cotton, Regular Fit, Premium Quality',
        productSpecs: {
          marketingDescription: `Elevate your style with Premium Item ${i}.`
        },
        images: [
          { url: images[imgIndex], isMain: true },
          { url: images[nextImgIndex], isMain: false }
        ],
        sizes: sizes.map(s => ({ size: s, stock: 10 + i })),
        colors: ['Blue', 'Black', 'White', 'Gray', 'Tan'][i % 5],
        isFeatured: i % 5 === 0,
        isNewArrival: i % 3 === 0,
        isTrending: i % 4 === 0,
        rating: 4 + (Math.random()),
        numReviews: 10 + i,
        isActive: true,
        brand: 'Black Locust'
      });
    }

    await Product.insertMany(products);
    console.log('Created 93 products');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
