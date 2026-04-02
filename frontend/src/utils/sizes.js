// Comprehensive clothing sizes configuration
export const CLOTHING_SIZES = {
  // Standard sizes for most clothing
  standard: [
    { name: 'XS', label: 'Extra Small', description: 'Chest: 34-36" (86-91cm)' },
    { name: 'S', label: 'Small', description: 'Chest: 37-39" (94-99cm)' },
    { name: 'M', label: 'Medium', description: 'Chest: 40-42" (101-107cm)' },
    { name: 'L', label: 'Large', description: 'Chest: 43-45" (109-114cm)' },
    { name: 'XL', label: 'Extra Large', description: 'Chest: 46-48" (117-122cm)' },
    { name: 'XXL', label: '2X Large', description: 'Chest: 49-51" (124-129cm)' },
    { name: 'XXXL', label: '3X Large', description: 'Chest: 52-54" (132-137cm)' },
    { name: '4XL', label: '4X Large', description: 'Chest: 55-57" (140-142cm)' },
    { name: '5XL', label: '5X Large', description: 'Chest: 58-60" (147-152cm)' }
  ],

  // Numeric sizes for specific items
  numeric: [
    { name: '28', label: '28', description: 'Waist: 28" (71cm)' },
    { name: '30', label: '30', description: 'Waist: 30" (76cm)' },
    { name: '32', label: '32', description: 'Waist: 32" (81cm)' },
    { name: '34', label: '34', description: 'Waist: 34" (86cm)' },
    { name: '36', label: '36', description: 'Waist: 36" (91cm)' },
    { name: '38', label: '38', description: 'Waist: 38" (97cm)' },
    { name: '40', label: '40', description: 'Waist: 40" (102cm)' },
    { name: '42', label: '42', description: 'Waist: 42" (107cm)' },
    { name: '44', label: '44', description: 'Waist: 44" (112cm)' },
    { name: '46', label: '46', description: 'Waist: 46" (117cm)' },
    { name: '48', label: '48', description: 'Waist: 48" (122cm)' }
  ],

  // Plus sizes
  plus: [
    { name: '1X', label: '1X Plus', description: 'Chest: 44-46" (112-117cm)' },
    { name: '2X', label: '2X Plus', description: 'Chest: 48-50" (122-127cm)' },
    { name: '3X', label: '3X Plus', description: 'Chest: 52-54" (132-137cm)' },
    { name: '4X', label: '4X Plus', description: 'Chest: 56-58" (142-147cm)' },
    { name: '5X', label: '5X Plus', description: 'Chest: 60-62" (152-157cm)' },
    { name: '6X', label: '6X Plus', description: 'Chest: 64-66" (163-168cm)' }
  ],

  // Kids sizes
  kids: [
    { name: '2T', label: '2T (Toddler)', description: 'Age: 2 years' },
    { name: '3T', label: '3T (Toddler)', description: 'Age: 3 years' },
    { name: '4T', label: '4T (Toddler)', description: 'Age: 4 years' },
    { name: '5', label: '5 (Kids)', description: 'Age: 5 years' },
    { name: '6', label: '6 (Kids)', description: 'Age: 6 years' },
    { name: '7', label: '7 (Kids)', description: 'Age: 7 years' },
    { name: '8', label: '8 (Kids)', description: 'Age: 8 years' },
    { name: '10', label: '10 (Kids)', description: 'Age: 10 years' },
    { name: '12', label: '12 (Kids)', description: 'Age: 12 years' },
    { name: '14', label: '14 (Kids)', description: 'Age: 14 years' },
    { name: '16', label: '16 (Kids)', description: 'Age: 16 years' }
  ]
};

// Shoe sizes
export const SHOE_SIZES = {
  men: [
    { name: '6', label: 'US 6', description: 'EU 39' },
    { name: '6.5', label: 'US 6.5', description: 'EU 39.5' },
    { name: '7', label: 'US 7', description: 'EU 40' },
    { name: '7.5', label: 'US 7.5', description: 'EU 40.5' },
    { name: '8', label: 'US 8', description: 'EU 41' },
    { name: '8.5', label: 'US 8.5', description: 'EU 41.5' },
    { name: '9', label: 'US 9', description: 'EU 42' },
    { name: '9.5', label: 'US 9.5', description: 'EU 42.5' },
    { name: '10', label: 'US 10', description: 'EU 43' },
    { name: '10.5', label: 'US 10.5', description: 'EU 43.5' },
    { name: '11', label: 'US 11', description: 'EU 44' },
    { name: '11.5', label: 'US 11.5', description: 'EU 44.5' },
    { name: '12', label: 'US 12', description: 'EU 45' },
    { name: '13', label: 'US 13', description: 'EU 46' },
    { name: '14', label: 'US 14', description: 'EU 47' }
  ],
  women: [
    { name: '5', label: 'US 5', description: 'EU 35' },
    { name: '5.5', label: 'US 5.5', description: 'EU 35.5' },
    { name: '6', label: 'US 6', description: 'EU 36' },
    { name: '6.5', label: 'US 6.5', description: 'EU 36.5' },
    { name: '7', label: 'US 7', description: 'EU 37' },
    { name: '7.5', label: 'US 7.5', description: 'EU 37.5' },
    { name: '8', label: 'US 8', description: 'EU 38' },
    { name: '8.5', label: 'US 8.5', description: 'EU 38.5' },
    { name: '9', label: 'US 9', description: 'EU 39' },
    { name: '9.5', label: 'US 9.5', description: 'EU 39.5' },
    { name: '10', label: 'US 10', description: 'EU 40' },
    { name: '10.5', label: 'US 10.5', description: 'EU 40.5' },
    { name: '11', label: 'US 11', description: 'EU 41' },
    { name: '12', label: 'US 12', description: 'EU 42' }
  ],
  kids: [
    { name: '1', label: 'US 1', description: 'EU 33' },
    { name: '2', label: 'US 2', description: 'EU 34' },
    { name: '3', label: 'US 3', description: 'EU 35' },
    { name: '4', label: 'US 4', description: 'EU 36' },
    { name: '5', label: 'US 5', description: 'EU 37' },
    { name: '6', label: 'US 6', description: 'EU 38' },
    { name: '7', label: 'US 7', description: 'EU 39' }
  ]
};

// Category-based size recommendations
export const CATEGORY_SIZES = {
  'T-Shirts': ['standard'],
  'Shirts': ['standard', 'plus'],
  'Men\'s Shirts': ['standard', 'plus'],
  'Pants': ['numeric', 'plus'],
  'Men\'s Bottoms': ['numeric', 'plus'],
  'Jeans': ['numeric', 'plus'],
  'Jackets': ['standard', 'plus'],
  'Men\'s Outerwear': ['standard', 'plus'],
  'Sweaters': ['standard', 'plus'],
  'Accessories': ['standard'],
  'shoes': ['men', 'women', 'kids'],
  'all': ['standard', 'numeric', 'plus', 'kids']
};

// Helper functions
export const getAvailableSizes = (category) => {
  if (category === 'shoes') {
    return SHOE_SIZES;
  }
  
  const sizeTypes = CATEGORY_SIZES[category] || ['standard'];
  const availableSizes = {};
  
  sizeTypes.forEach(type => {
    if (CLOTHING_SIZES[type]) {
      availableSizes[type] = CLOTHING_SIZES[type];
    }
  });
  
  return availableSizes;
};

export const getSizeLabel = (sizeName, sizeType = 'standard') => {
  if (sizeType === 'men' || sizeType === 'women' || sizeType === 'kids') {
    const shoeSize = SHOE_SIZES[sizeType]?.find(s => s.name === sizeName);
    return shoeSize ? shoeSize.label : sizeName;
  }
  
  const clothingSize = CLOTHING_SIZES[sizeType]?.find(s => s.name === sizeName);
  return clothingSize ? clothingSize.label : sizeName;
};

export const getSizeDescription = (sizeName, sizeType = 'standard') => {
  if (sizeType === 'men' || sizeType === 'women' || sizeType === 'kids') {
    const shoeSize = SHOE_SIZES[sizeType]?.find(s => s.name === sizeName);
    return shoeSize ? shoeSize.description : '';
  }
  
  const clothingSize = CLOTHING_SIZES[sizeType]?.find(s => s.name === sizeName);
  return clothingSize ? clothingSize.description : '';
};
