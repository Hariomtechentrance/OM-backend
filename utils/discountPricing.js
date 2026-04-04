/**
 * @param {object} product - lean or doc with discountMode, discountPercent
 * @param {object} siteSettings - { globalDiscountEnabled, globalDiscountPercent }
 * @returns {number} 0-100
 */
export function effectiveDiscountPercent(product, siteSettings) {
  const mode = product?.discountMode === 'custom' ? 'custom' : 'inherit';
  if (mode === 'custom') {
    return Math.min(100, Math.max(0, Number(product?.discountPercent) || 0));
  }
  const globalOn = siteSettings?.globalDiscountEnabled === true;
  if (!globalOn) return 0;
  return Math.min(100, Math.max(0, Number(siteSettings?.globalDiscountPercent) || 0));
}

export function priceAfterDiscount(basePrice, discountPct) {
  const b = Number(basePrice) || 0;
  const d = Math.min(100, Math.max(0, Number(discountPct) || 0));
  return Math.round(b * (1 - d / 100) * 100) / 100;
}

/**
 * Attach storefront fields: price = payable, originalPrice = MRP when discounted
 */
export function enrichProductForStorefront(productLean, siteSettings) {
  if (!productLean) return productLean;
  const listPrice = Number(productLean.price) || 0;
  const pct = effectiveDiscountPercent(productLean, siteSettings);
  const salePrice = priceAfterDiscount(listPrice, pct);
  return {
    ...productLean,
    listPrice,
    salePrice,
    discountPercentApplied: pct,
    price: salePrice,
    originalPrice: pct > 0 ? listPrice : undefined,
    mrp: pct > 0 ? listPrice : undefined
  };
}
