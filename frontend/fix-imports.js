// Script to fix all missing import files
const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING MISSING IMPORT FILES...');

// Files to copy from Layout to their proper locations
const filesToCopy = [
  {
    source: './src/components/Layout/Header.jsx',
    dest: './src/components/Header/Header.jsx'
  },
  {
    source: './src/components/Layout/Header.css', 
    dest: './src/components/Header/Header.css'
  },
  {
    source: './src/components/Layout/Footer.jsx',
    dest: './src/components/Footer/Footer.jsx'
  },
  {
    source: './src/components/Layout/Footer.css',
    dest: './src/components/Footer/Footer.css'
  },
  {
    source: './src/components/Layout/Hero.jsx',
    dest: './src/components/Hero/Hero.jsx'
  },
  {
    source: './src/components/Layout/Hero.css',
    dest: './src/components/Hero/Hero.css'
  }
];

filesToCopy.forEach(({ source, dest }) => {
  try {
    // Create directory if it doesn't exist
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      console.log(`📁 Created directory: ${destDir}`);
    }
    
    // Copy file
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, dest);
      console.log(`✅ Copied: ${source} → ${dest}`);
    } else {
      console.log(`❌ Source not found: ${source}`);
    }
  } catch (error) {
    console.log(`❌ Error copying ${source}: ${error.message}`);
  }
});

console.log('🎉 IMPORT FIXES COMPLETE!');
console.log('🔄 Please restart the frontend server');
