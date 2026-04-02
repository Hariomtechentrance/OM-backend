// Comprehensive color mapping utility for accurate color display
export const getColorHex = (colorName) => {
  if (!colorName) return '#cccccc';
  
  const color = colorName.toLowerCase().trim();
  
  // Direct hex code support
  if (color.startsWith('#')) {
    return color;
  }
  
  // Comprehensive color mapping
  const colorMap = {
    // Basic colors
    'black': '#000000',
    'white': '#ffffff',
    'red': '#ff0000',
    'blue': '#0000ff',
    'green': '#008000',
    'yellow': '#ffff00',
    'orange': '#ffa500',
    'purple': '#800080',
    'pink': '#ffc0cb',
    'brown': '#964b00',
    'gray': '#808080',
    'grey': '#808080',
    'silver': '#c0c0c0',
    'gold': '#ffd700',
    'maroon': '#800000',
    'navy': '#000080',
    'teal': '#008080',
    'olive': '#808000',
    'lime': '#32cd32',
    'aqua': '#00ffff',
    'fuchsia': '#ff00ff',
    
    // Shades and variations
    'light gray': '#d3d3d3',
    'light grey': '#d3d3d3',
    'dark gray': '#a9a9a9',
    'dark grey': '#a9a9a9',
    'charcoal': '#36454f',
    'slate': '#708090',
    'onyx': '#0f0f0f',
    'jet black': '#000000',
    'snow white': '#fffafa',
    'ivory': '#fffff0',
    'cream': '#fffdd0',
    'beige': '#f5f5dc',
    'tan': '#d2b48c',
    'khaki': '#c3b091',
    
    // Reds and pinks
    'dark red': '#8b0000',
    'crimson': '#dc143c',
    'ruby': '#e0115f',
    'coral': '#ff7f50',
    'salmon': '#fa8072',
    'rose': '#ff007f',
    'magenta': '#ff00ff',
    'hot pink': '#ff69b4',
    'deep pink': '#ff1493',
    
    // Blues
    'light blue': '#add8e6',
    'sky blue': '#87ceeb',
    'baby blue': '#89cff0',
    'dark blue': '#00008b',
    'royal blue': '#4169e1',
    'navy blue': '#000080',
    'steel blue': '#4682b4',
    'turquoise': '#40e0d0',
    'cyan': '#00ffff',
    'azure': '#007fff',
    
    // Greens
    'light green': '#90ee90',
    'dark green': '#006400',
    'forest green': '#228b22',
    'lime green': '#32cd32',
    'mint': '#98ff98',
    'emerald': '#50c878',
    'olive green': '#808000',
    'sea green': '#2e8b57',
    'sage': '#b2ac88',
    
    // Browns and oranges
    'dark brown': '#654321',
    'chocolate': '#d2691e',
    'coffee': '#6f4e37',
    'copper': '#b87333',
    'bronze': '#cd7f32',
    'dark orange': '#ff8c00',
    'peach': '#ffdab9',
    'apricot': '#fbceb1',
    'terracotta': '#e2725b',
    
    // Purples and violets
    'lavender': '#e6e6fa',
    'violet': '#ee82ee',
    'indigo': '#4b0082',
    'plum': '#dda0dd',
    'orchid': '#da70d6',
    'thistle': '#d8bfd8',
    'periwinkle': '#ccccff',
    
    // Yellows and golds
    'light yellow': '#ffffe0',
    'dark yellow': '#ffb300',
    'golden': '#ffd700',
    'mustard': '#ffdb58',
    'lemon': '#fff700',
    'corn': '#fff8dc',
    
    // Specialty colors
    'burgundy': '#800020',
    'wine': '#722f37',
    'plum': '#dda0dd',
    'sapphire': '#0f52ba',
    'pearl': '#f8f6ff',
    'emerald': '#50c878',
    'ruby': '#e0115f',
    'diamond': '#b9f2ff',
    'amethyst': '#9966cc',
    'topaz': '#ffc87c',
    'jade': '#00a86b',
    'ivory': '#fffff0',
    'linen': '#faf0e6',
    'ecru': '#c2b280',
    'sand': '#c2b280',
    'taupe': '#483c32',
    'sienna': '#882d17',
    'umber': '#635147',
    
    // Fashion/clothing specific colors
    'navy': '#000080',
    'cream': '#fffdd0',
    'ivory': '#fffff0',
    'charcoal': '#36454f',
    'slate': '#708090',
    'stone': '#918e7c',
    'camel': '#c19a6b',
    'chestnut': '#954535',
    'brick': '#b22222',
    'copper': '#b87333',
    'bronze': '#cd7f32',
    'steel': '#71797e',
    'gunmetal': '#2c3539',
    'graphite': '#36454f',
    'carbon': '#36454f',
    'ash': '#b2beb5',
    'smoke': '#74766f',
    'fog': '#d3d3d3',
    'mist': '#d3d3d3',
    'cloud': '#d3d3d3',
    'storm': '#4f4f4f',
    'night': '#0c0c0c',
    'midnight': '#191970',
    'twilight': '#4e518b',
    'dawn': '#f3e5ab',
    'dusk': '#4e5481',
    'sunset': '#fd5e53',
    'sunrise': '#ffd4a3',
    'autumn': '#ca6f1e',
    'winter': '#f0f8ff',
    'spring': '#87ff2a',
    'summer': '#00bfff',
    'fall': '#cd853f',
    
    // Multi-word colors with spaces
    'forest green': '#228b22',
    'navy blue': '#000080',
    'sky blue': '#87ceeb',
    'light blue': '#add8e6',
    'dark blue': '#00008b',
    'light gray': '#d3d3d3',
    'light grey': '#d3d3d3',
    'dark gray': '#a9a9a9',
    'dark grey': '#a9a9a9',
    'jet black': '#000000',
    'snow white': '#fffafa',
    'hot pink': '#ff69b4',
    'deep pink': '#ff1493',
    'royal blue': '#4169e1',
    'steel blue': '#4682b4',
    'lime green': '#32cd32',
    'mint green': '#98ff98',
    'dark red': '#8b0000',
    'dark brown': '#654321',
    'dark orange': '#ff8c00',
    'light yellow': '#ffffe0',
    'dark yellow': '#ffb300',
    'forest green': '#228b22',
    'olive green': '#808000',
    'sea green': '#2e8b57',
    'sky blue': '#87ceeb',
    'baby blue': '#89cff0',
    'royal blue': '#4169e1',
    'steel blue': '#4682b4',
    'turquoise blue': '#40e0d0',
    'pale pink': '#fadadd',
    'hot pink': '#ff69b4',
    'deep pink': '#ff1493',
    'coral pink': '#f88379',
    'salmon pink': '#ff91a4',
    'rose pink': '#ff66cc',
    'fuchsia pink': '#ff77ff',
    'lavender pink': '#fdb0c0',
    'orchid pink': '#f2bdbd',
    'bubblegum pink': '#ffc1cc',
    'cotton candy': '#ffb7d0',
    'strawberry': '#fc5a8a',
    'raspberry': '#e30b5c',
    'cherry': '#de3163',
    'cranberry': '#9e0039',
    'pomegranate': '#d3434e',
    'watermelon': '#fc6c85',
    'grape': '#6f3d89',
    'plum purple': '#8e4585',
    'orchid purple': '#9932cc',
    'lavender purple': '#967bb6',
    'violet purple': '#8b008b',
    'indigo purple': '#4b0082',
    'periwinkle purple': '#ccccff',
    'blue purple': '#6a0dad',
    'royal purple': '#7851a9',
    'electric purple': '#bf00ff',
    'ultra violet': '#645394',
    'electric blue': '#7df9ff',
    'ice blue': '#d0f1f9',
    'powder blue': '#b0e0e6',
    'baby blue': '#89cff0',
    'sky blue': '#87ceeb',
    'cerulean': '#007ba7',
    'cobalt': '#0047ab',
    'azure': '#007fff',
    'sapphire': '#0f52ba',
    'turquoise': '#40e0d0',
    'cyan': '#00ffff',
    'aqua': '#00ffff',
    'teal': '#008080',
    'sea green': '#2e8b57',
    'mint green': '#98ff98',
    'lime green': '#32cd32',
    'chartreuse': '#dfff00',
    'yellow green': '#9acd32',
    'olive green': '#808000',
    'dark green': '#006400',
    'forest green': '#228b22',
    'emerald green': '#50c878',
    'jade green': '#00a86b',
    'pine green': '#01796f',
    'sage green': '#b2ac88',
    'moss green': '#8a9a5b',
    'khaki green': '#c3b091',
    'army green': '#4b5320',
    'olive drab': '#6b8e23',
    'lime': '#32cd32',
    'lemon': '#fff700',
    'yellow': '#ffff00',
    'gold': '#ffd700',
    'golden': '#ffd700',
    'brass': '#b5651d',
    'bronze': '#cd7f32',
    'copper': '#b87333',
    'rust': '#b7410e',
    'terracotta': '#e2725b',
    'brick': '#b22222',
    'firebrick': '#b22222',
    'crimson': '#dc143c',
    'scarlet': '#ff2400',
    'vermilion': '#e34234',
    'carmine': '#960018',
    'burgundy': '#800020',
    'wine': '#722f37',
    'maroon': '#800000',
    'dark red': '#8b0000',
    'blood red': '#660000',
    'cherry red': '#de3163',
    'rose red': '#c21e56',
    'ruby red': '#e0115f',
    'pink': '#ffc0cb',
    'light pink': '#ffb6c1',
    'hot pink': '#ff69b4',
    'deep pink': '#ff1493',
    'fuchsia': '#ff00ff',
    'magenta': '#ff00ff',
    'orchid': '#da70d6',
    'plum': '#dda0dd',
    'violet': '#ee82ee',
    'lavender': '#e6e6fa',
    'thistle': '#d8bfd8',
    'wisteria': '#c9a0dc',
    'lilac': '#c8a2c8',
    'mauve': '#e0b0ff',
    'periwinkle': '#ccccff',
    'indigo': '#4b0082',
    'blue': '#0000ff',
    'light blue': '#add8e6',
    'sky blue': '#87ceeb',
    'baby blue': '#89cff0',
    'dark blue': '#00008b',
    'navy blue': '#000080',
    'royal blue': '#4169e1',
    'steel blue': '#4682b4',
    'cornflower': '#6495ed',
    'cerulean': '#007ba7',
    'azure': '#007fff',
    'sapphire': '#0f52ba',
    'cobalt': '#0047ab',
    'teal': '#008080',
    'cyan': '#00ffff',
    'aqua': '#00ffff',
    'turquoise': '#40e0d0',
    'green': '#008000',
    'light green': '#90ee90',
    'dark green': '#006400',
    'forest green': '#228b22',
    'lime green': '#32cd32',
    'mint': '#98ff98',
    'emerald': '#50c878',
    'jade': '#00a86b',
    'olive': '#808000',
    'yellow': '#ffff00',
    'gold': '#ffd700',
    'orange': '#ffa500',
    'dark orange': '#ff8c00',
    'coral': '#ff7f50',
    'salmon': '#fa8072',
    'peach': '#ffdab9',
    'apricot': '#fbceb1',
    'brown': '#964b00',
    'tan': '#d2b48c',
    'beige': '#f5f5dc',
    'cream': '#fffdd0',
    'ivory': '#fffff0',
    'white': '#ffffff',
    'black': '#000000',
    'gray': '#808080',
    'grey': '#808080',
    'silver': '#c0c0c0',
    'charcoal': '#36454f',
    'slate': '#708090',
    'stone': '#918e7c'
  };
  
  // Return mapped color or try to parse hex/rgb
  if (colorMap[color]) {
    return colorMap[color];
  }
  
  // Try to parse if it's already a valid CSS color
  const testElement = document.createElement('div');
  testElement.style.color = colorName;
  document.body.appendChild(testElement);
  const computedColor = window.getComputedStyle(testElement).color;
  document.body.removeChild(testElement);
  
  // If browser recognizes the color, convert to hex
  if (computedColor && computedColor !== 'rgb(0, 0, 0)' && computedColor !== 'rgba(0, 0, 0, 0)') {
    return computedColor;
  }
  
  // Fallback to gray
  return '#cccccc';
};

// Function to validate if a color is displayable
export const isValidColor = (color) => {
  if (!color) return false;
  
  // Check if it's a hex code
  if (color.startsWith('#')) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }
  
  // Check if it's rgb/rgba
  if (color.startsWith('rgb')) {
    return /^rgb(a?)\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/.test(color);
  }
  
  // Check if it's a named color
  const testElement = document.createElement('div');
  testElement.style.color = color;
  document.body.appendChild(testElement);
  const computedColor = window.getComputedStyle(testElement).color;
  document.body.removeChild(testElement);
  
  return computedColor && computedColor !== 'rgb(0, 0, 0)' && computedColor !== 'rgba(0, 0, 0, 0)';
};
