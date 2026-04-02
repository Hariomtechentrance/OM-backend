/**
 * Build query string for GET /api/products from shared filter state.
 * @param {object} f - UI filter state from GlobalProductFilters
 * @param {object} preset - Always applied (e.g. { isNewArrival: true } or { collection: 'winter' })
 */
export function filtersToSearchParams(f = {}, preset = {}) {
  const p = new URLSearchParams();
  const merged = { ...f, ...preset };

  if (merged.collection && String(merged.collection).trim()) {
    p.set('collection', String(merged.collection).trim());
  }
  if (merged.category && String(merged.category).trim()) {
    p.set('category', String(merged.category).trim());
  }

  if (merged.minPrice !== '' && merged.minPrice != null && !Number.isNaN(Number(merged.minPrice))) {
    p.set('minPrice', String(merged.minPrice));
  }
  if (merged.maxPrice !== '' && merged.maxPrice != null && !Number.isNaN(Number(merged.maxPrice))) {
    p.set('maxPrice', String(merged.maxPrice));
  }

  if (merged.brand && String(merged.brand).trim()) {
    p.set('brand', String(merged.brand).trim());
  }

  if (Array.isArray(merged.sizes) && merged.sizes.length) {
    p.set('sizes', merged.sizes.join(','));
  }
  if (Array.isArray(merged.colors) && merged.colors.length) {
    p.set('colors', merged.colors.join(','));
  }

  if (truthy(merged.isNewArrival)) p.set('isNewArrival', 'true');
  if (truthy(merged.isFeatured)) p.set('isFeatured', 'true');
  if (truthy(merged.isTrending)) p.set('isTrending', 'true');

  const sort = merged.sortBy || 'featured';
  if (sort === 'price-low') p.set('sortBy', 'price-asc');
  else if (sort === 'price-high') p.set('sortBy', 'price-desc');
  else if (sort === 'newest') p.set('sortBy', 'newest');
  else if (sort === 'oldest') p.set('sortBy', 'oldest');
  else if (sort === 'rating') p.set('sortBy', 'rating');
  else if (sort === 'name-asc') p.set('sortBy', 'name-asc');
  else if (sort === 'name-desc') p.set('sortBy', 'name-desc');
  else if (sort === 'name') p.set('sortBy', 'name');

  return p;
}

function truthy(v) {
  return v === true || v === 'true' || v === 1 || v === '1';
}

export const defaultProductFilterState = {
  category: '',
  collection: '',
  minPrice: '',
  maxPrice: '',
  brand: '',
  sizes: [],
  colors: [],
  sortBy: 'featured',
};
