// Fix duplicate collections and link products correctly
import mongoose from 'mongoose';
mongoose.connect('mongodb://localhost:27017/blacklocust');
import Collection from './models/Collection.js';
import Product from './models/Product.js';

async function fixCollections() {
  try {
    console.log('🔧 Fixing collections and product links...');
    
    // Find all collections
    const allCollections = await Collection.find({});
    console.log(`📊 Found ${allCollections.length} collections in database`);
    
    // Group by slug to find duplicates
    const collectionMap = new Map();
    allCollections.forEach(collection => {
      const slug = collection.slug;
      if (!collectionMap.has(slug)) {
        collectionMap.set(slug, []);
      }
      collectionMap.get(slug).push(collection);
    });
    
    console.log('🔍 Checking for duplicate collections by slug:');
    const duplicates = [];
    collectionMap.forEach((collections, slug) => {
      if (collections.length > 1) {
        console.log(`⚠️  Duplicate slug "${slug}": ${collections.length} collections`);
        duplicates.push({ slug, collections });
      } else {
        console.log(`✅ Unique slug "${slug}": ${collections[0]._id}`);
      }
    });
    
    // For each duplicate, keep the first one and update products to use it
    for (const { slug, collections } of duplicates) {
      const keepCollection = collections[0];
      const removeCollections = collections.slice(1);
      
      console.log(`\n🔧 Processing duplicates for "${slug}":`);
      console.log(`   Keeping: ${keepCollection._id}`);
      console.log(`   Removing: ${removeCollections.map(c => c._id).join(', ')}`);
      
      // Update all products to use the kept collection
      const updateResult = await Product.updateMany(
        { collection: { $in: removeCollections.map(c => c._id) } },
        { collection: keepCollection._id }
      );
      
      console.log(`   Updated ${updateResult.modifiedCount} products`);
      
      // Remove duplicate collections
      const deleteResult = await Collection.deleteMany(
        { _id: { $in: removeCollections.map(c => c._id) } }
      );
      
      console.log(`   Deleted ${deleteResult.deletedCount} duplicate collections`);
    }
    
    // Verify the fix
    console.log('\n🔍 Verification:');
    const finalCollections = await Collection.find({});
    console.log(`📊 Final collection count: ${finalCollections.length}`);
    
    // Test product links
    const checkedCollection = await Collection.findOne({ slug: 'checked-collection' });
    if (checkedCollection) {
      const checkedProducts = await Product.find({ collection: checkedCollection._id });
      console.log(`📦 Checked Collection products: ${checkedProducts.length}`);
      checkedProducts.forEach(p => console.log(`   - ${p.name}`));
    }
    
    const officeCollection = await Collection.findOne({ slug: 'office-collection' });
    if (officeCollection) {
      const officeProducts = await Product.find({ collection: officeCollection._id });
      console.log(`📦 Office Collection products: ${officeProducts.length}`);
      officeProducts.forEach(p => console.log(`   - ${p.name}`));
    }
    
    const partyCollection = await Collection.findOne({ slug: 'party-wear-collection' });
    if (partyCollection) {
      const partyProducts = await Product.find({ collection: partyCollection._id });
      console.log(`📦 Party Wear Collection products: ${partyProducts.length}`);
      partyProducts.forEach(p => console.log(`   - ${p.name}`));
    }
    
    console.log('\n✅ Collections and products fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixCollections();
