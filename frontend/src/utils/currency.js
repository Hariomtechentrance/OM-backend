/**
 * Currency utility functions for Indian Rupees
 */

/**
 * Format price as Indian Rupees
 * @param {number} price - The price to format
 * @returns {string} Formatted price in Indian Rupees
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Convert USD to INR (approximate conversion rate)
 * @param {number} usdPrice - Price in USD
 * @returns {number} Price in INR
 */
export const convertUSDToINR = (usdPrice) => {
  // Approximate conversion rate: 1 USD = 83 INR
  return Math.round(usdPrice * 83);
};

/**
 * Get currency symbol for Indian Rupees
 * @returns {string} Indian Rupee symbol
 */
export const getCurrencySymbol = () => {
  return '₹';
};

/**
 * Format price with custom options
 * @param {number} price - The price to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted price
 */
export const formatPriceWithOptions = (price, options = {}) => {
  const defaultOptions = {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options
  };
  
  return new Intl.NumberFormat('en-IN', defaultOptions).format(price);
};
