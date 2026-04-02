/**
 * Import full product catalog from data/catalog.tsv (tab-separated).
 * Run: npm run import-catalog  (from backend/)
 * Requires: MONGO_URI in .env
 *
 * Data: backend/data/catalog.tsv, or split files catalog-part1.tsv, catalog-part2.tsv, ...
 * Quoted fields may contain newlines (spec blocks).
 * Each row becomes unique skuCode: BASE-SKU--color-slug (duplicate BL codes per color).
 * Dry run: DRY_IMPORT=1 node scripts/importFullCatalog.js
 *
 * Columns: colorLabel, name, collectionName, sku, fitLine, marketingDesc,
 *   h1Heading, specsBlock, price, stock, (empty), dropboxUrl, imageUrl
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import 'dotenv/config';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Collection from '../models/Collection.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

const FIT_ENUM = ['Regular Fit', 'Tailored Fit', 'Slim Fit', 'Relaxed Fit'];

function pickFit(text) {
  if (!text) return 'Regular Fit';
  for (const f of FIT_ENUM) {
    if (text.includes(f)) return f;
  }
  if (/slim/i.test(text)) return 'Slim Fit';
  if (/relaxed|oversize|over size/i.test(text)) return 'Relaxed Fit';
  if (/tailored/i.test(text)) return 'Tailored Fit';
  return 'Regular Fit';
}

function slugifyCollection(name) {
  if (!name) return 'uncategorized';
  const key = name.trim().toLowerCase();
  const map = {
    'checked collection': 'checked-collection',
    'office collection': 'office-collection',
    'party wear collection': 'party-wear-collection',
    'casual collection': 'casual-collection',
    'new collection': 'new-collection',
    'winter collection': 'winter-collection',
    'polos': 'polos',
    trusers: 'trousers-collection',
    trousers: 'trousers-collection',
    denim: 'denim-collection',
    'formal pants': 'formal-pants',
    'summer collections': 'summer-collection',
    'summer collection': 'summer-collection',
    'cargo collection': 'cargo-collection'
  };
  if (map[key]) return map[key];
  return key
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'uncategorized';
}

function displayNameFromSlug(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function slugifyColor(label) {
  if (!label || !String(label).trim()) return 'variant';
  return String(label)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'variant';
}

function readCatalogRaw() {
  if (!fs.existsSync(DATA_DIR)) return '';
  const main = path.join(DATA_DIR, 'catalog.tsv');
  if (fs.existsSync(main)) return fs.readFileSync(main, 'utf8');
  const parts = fs
    .readdirSync(DATA_DIR)
    .filter((f) => /^catalog-part\d+\.tsv$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (parts.length === 0) return '';
  return parts.map((f) => fs.readFileSync(path.join(DATA_DIR, f), 'utf8')).join('\n');
}

/** Tab-separated rows; quoted fields may contain newlines */
function splitTSVRows(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      field += c;
    } else if (c === '\t' && !inQuotes) {
      row.push(field.trim());
      field = '';
    } else if ((c === '\n' || c === '\r') && !inQuotes) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field.trim());
      field = '';
      if (row.some((x) => x !== '')) rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field.trim() || row.length) {
    row.push(field.trim());
    if (row.some((x) => x !== '')) rows.push(row);
  }
  return rows;
}

async function ensureCategory() {
  let cat = await Category.findOne({ slug: 'mens-apparel' });
  if (!cat) {
    cat = await Category.create({
      name: 'Mens Apparel',
      slug: 'mens-apparel',
      description: 'Men’s clothing and accessories',
      image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&q=80',
      isActive: true
    });
  }
  return cat._id;
}

async function ensureCollection(slug) {
  let col = await Collection.findOne({ slug });
  if (!col) {
    col = await Collection.create({
      name: displayNameFromSlug(slug),
      slug,
      description: `${displayNameFromSlug(slug)} — Black Locust`,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      isActive: true,
      showInNavbar: true,
      order: 0
    });
    console.log('Created collection:', slug);
  }
  return col._id;
}

function parseRow(parts) {
  if (!parts || parts.length < 5) return null;
  const skuIdx = parts.findIndex((p) =>
    /^BL-[A-Z0-9\-\/\.W]+$/i.test(p.replace(/\s/g, ''))
  );
  if (skuIdx < 0 || parts.length < 5) return null;

  const sku = parts[skuIdx].replace(/\s/g, '');
  const colorLabel = parts[0] || '';
  const name = parts[1] || 'Untitled';
  const collectionRaw = parts[2] || '';
  const fitLine = parts[skuIdx + 1] || '';

  const nums = [];
  for (let i = skuIdx + 2; i < parts.length; i++) {
    const raw = parts[i].replace(/,/g, '');
    if (/^\d+$/.test(raw)) {
      const v = parseInt(raw, 10);
      if (v >= 1 && v <= 999999) nums.push({ i, v });
    }
  }

  let price = 0;
  let stock = 0;
  if (nums.length >= 2) {
    price = nums[nums.length - 2].v;
    stock = nums[nums.length - 1].v;
  } else if (nums.length === 1) {
    price = nums[0].v;
    stock = Math.max(20, Math.min(500, Math.floor(price / 4)));
  } else {
    return null;
  }

  const firstPriceIdx = nums.length >= 2 ? nums[nums.length - 2].i : nums[0]?.i ?? parts.length;
  const descSlice = parts.slice(skuIdx + 2, firstPriceIdx);
  let marketing = descSlice[0] || '';
  let h1 = descSlice[1] || name;
  let specsBlock = descSlice.slice(2).join('\n').trim();
  if (!marketing) marketing = name;
  if (!specsBlock) specsBlock = fitLine;

  const urls = parts
    .map((p) => p.replace(/^[`'"]+|[`'"]+$/g, '').trim())
    .filter((p) => /^https?:\/\//i.test(p));
  const productLink = urls.find((u) => u.includes('dropbox')) || urls[0] || '';
  const imageUrl =
    urls.find((u) => /imagekit|unsplash|img/i.test(u)) || urls[urls.length - 1] || productLink;

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const perSize = Math.max(5, Math.floor(stock / sizes.length));
  const sizesArr = sizes.map((size) => ({ size, stock: perSize }));

  const fit = pickFit(`${fitLine} ${specsBlock}`);

  const variantSku = `${sku}--${slugifyColor(colorLabel)}`;

  return {
    sku: variantSku,
    baseSku: sku,
    name: name.slice(0, 200),
    colorLabel,
    collectionSlug: slugifyCollection(collectionRaw),
    description: marketing.slice(0, 4000) || name,
    h1Heading: (h1 || name).slice(0, 300),
    specifications: (specsBlock || fitLine || 'See product details.').slice(0, 8000),
    productSpecs: {
      fit,
      availableSizes: sizesArr,
      marketingDescription: marketing.slice(0, 2000) || name,
      technicalSpecs: {
        fabric: /cotton|linen|denim|knit/i.test(specsBlock) ? 'Cotton blend' : '',
        sleeves: /half/i.test(specsBlock) ? 'Half' : 'Full',
        collar: /collar|spread/i.test(specsBlock) ? 'Spread Collar' : 'Spread Collar',
        pocket: '',
        occasion: 'Casual & Formal'
      }
    },
    price,
    totalStock: stock,
    sizes: sizesArr,
    colors: colorLabel ? [colorLabel.trim()] : ['Default'],
    productLink: productLink.slice(0, 2000),
    images: imageUrl ? [{ url: imageUrl.slice(0, 2000), public_id: variantSku }] : [],
    brand: 'Black Locust',
    availability: stock > 0 ? 'in_stock' : 'out_of_stock',
    isActive: true,
    tags: [collectionRaw, colorLabel].filter(Boolean).map((t) => String(t).slice(0, 40))
  };
}

async function run() {
  const raw = readCatalogRaw();
  if (!raw.trim()) {
    console.error('Missing catalog: add backend/data/catalog.tsv or backend/data/catalog-part*.tsv');
    process.exit(1);
  }

  const rows = splitTSVRows(raw);

  if (process.env.DRY_IMPORT === '1') {
    let ok = 0;
    for (const parts of rows) {
      if (parseRow(parts)) ok++;
    }
    console.log(`Dry run: parsed ${ok} product rows from ${rows.length} TSV rows`);
    process.exit(0);
  }

  if (!process.env.MONGO_URI) {
    console.error('Set MONGO_URI in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  const categoryId = await ensureCategory();
  const collectionCache = new Map();

  let ok = 0;
  let skipped = 0;

  for (const parts of rows) {
    const parsed = parseRow(parts);
    if (!parsed) {
      if (parts.some((p) => p && p.includes('BL-'))) skipped++;
      continue;
    }

    const { collectionSlug, sku, baseSku: _b, ...rest } = parsed;
    let collectionId = collectionCache.get(collectionSlug);
    if (!collectionId) {
      collectionId = await ensureCollection(collectionSlug);
      collectionCache.set(collectionSlug, collectionId);
    }

    const doc = {
      name: rest.name,
      description: rest.description,
      price: rest.price,
      category: categoryId,
      collection: collectionId,
      skuCode: sku,
      h1Heading: rest.h1Heading,
      productSpecs: rest.productSpecs,
      specifications: rest.specifications,
      productLink: rest.productLink || undefined,
      images: rest.images,
      sizes: rest.sizes,
      colors: rest.colors,
      totalStock: rest.totalStock,
      availability: rest.availability,
      brand: rest.brand,
      isActive: true,
      isFeatured: false,
      isNewArrival: /new collection|summer/i.test(collectionSlug),
      isTrending: false,
      tags: rest.tags
    };

    await Product.findOneAndUpdate(
      { skuCode: sku },
      { $set: doc },
      { upsert: true, new: true }
    );
    ok++;
  }

  console.log(`Imported/updated ${ok} products. Skipped malformed lines: ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
