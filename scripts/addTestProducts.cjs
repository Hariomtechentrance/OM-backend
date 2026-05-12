const https = require('https');

// Test products - small batch first
const testProducts = [
  {
    name: "Red Checked Twill Cotton Flannel Shirt",
    slug: "red-checked-twill-cotton-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Made from soft Twill Cotton Flannel, this red checked shirt delivers warmth, comfort, and timeless style for light winter days. Featuring a classic check pattern and regular fit, it's perfect for casual outings, layering, and everyday wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/oukd6qqtf9hqctfgku6x8/ACjykQX6PkKS1ls12XCc-Z0?rlkey=9hp85ddffys1i9qc0eldpc919&st=dfxwirn7&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Classic Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "checked", "casual"]
  },
  {
    name: "Men's Blue Checked Flannel Shirt",
    slug: "mens-blue-checked-flannel-shirt-monsoon",
    price: 1599,
    mrp: 1599,
    description: "Crafted from premium Twill Cotton Flannel, this blue checked shirt offers soft warmth and breathable comfort for cooler days. Featuring a classic check pattern and versatile regular fit, it's perfect for casual outings, winter layering, and everyday wear.",
    category: "men",
    collectionSlug: "monsoon-collection",
    images: ["https://www.dropbox.com/scl/fi/pr3cu0ojs9bp9548nmdy0/1.png?rlkey=euoudutao4h3mdouh7e4toupc&st=0yixvlbb&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pocket": "Chest Pocket",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["monsoon", "flannel", "blue", "checked"]
  }
];

async function addTestProducts() {
  try {
    console.log('Starting test product addition...');
    
    let totalCreated = 0;
    let totalErrors = 0;

    for (let i = 0; i < testProducts.length; i++) {
      const product = testProducts[i];
      
      try {
        const response = await https.request('http://localhost:5002/api/products/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product)
        });

        const result = JSON.parse(response.body);
        
        if (result.success) {
          totalCreated++;
          console.log(`✅ Created test product: ${product.name}`);
        } else {
          totalErrors++;
          console.error(`❌ Error creating test product ${product.name}:`, result.message);
        }
        
        // Wait between requests
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        totalErrors++;
        console.error(`❌ Error creating test product ${product.name}:`, error.message);
      }
    }

    console.log(`\n🎉 TEST PRODUCT ADDITION COMPLETE!`);
    console.log(`✅ Total Products Created: ${totalCreated}`);
    console.log(`❌ Total Errors: ${totalErrors}`);
    console.log(`📊 Success Rate: ${((totalCreated / (totalCreated + totalErrors)) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('❌ Test product addition error:', error);
  }
}

addTestProducts();
