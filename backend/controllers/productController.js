import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Collection from "../models/Collection.js";

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Expand user keywords so e.g. "pants" matches trousers, jeans, denim in DB copy */
function expandSearchTerms(raw) {
  const term = String(raw || "").trim();
  if (!term) return [];
  const lower = term.toLowerCase();
  const set = new Set([term]);
  const synonyms = {
    pant: ["trouser", "trousers", "jean", "jeans", "denim", "chino", "chinos", "cargo", "formal pant", "straight-fit"],
    pants: ["trouser", "trousers", "jean", "jeans", "denim", "chino", "chinos", "cargo", "pant", "formal"],
    shirt: ["polo", "polo t", "t-shirt", "tee", "shirt", "casual shirt"],
    shirts: ["shirt", "polo", "tee"],
    jean: ["denim", "jeans", "trouser"],
    jeans: ["denim", "jean", "trouser"],
    denim: ["jean", "jeans", "trouser"],
    trouser: ["pants", "pant", "formal"],
    trousers: ["pants", "pant", "formal"],
    tshirt: ["polo", "tee", "shirt"],
    shoe: ["sneaker", "boot", "loafer"],
  };
  const keys = [lower, lower.endsWith("s") ? lower.slice(0, -1) : `${lower}s`];
  for (const k of keys) {
    if (synonyms[k]) synonyms[k].forEach((x) => set.add(x));
  }
  return [...set];
}

function buildSearchFilter(search) {
  const patterns = expandSearchTerms(search);
  const orClauses = [];
  for (const p of patterns) {
    const e = escapeRegex(p);
    if (!e) continue;
    const re = new RegExp(e, "i");
    orClauses.push(
      { name: re },
      { description: re },
      { skuCode: re },
      { h1Heading: re },
      { specifications: re },
      { tags: re },
      { brand: re },
      { material: re },
      { colors: re },
      { "productSpecs.marketingDescription": re },
      { "productSpecs.technicalSpecs.fabric": re },
      { "productSpecs.technicalSpecs.occasion": re }
    );
  }
  return orClauses.length ? { $or: orClauses } : null;
}

/*
---------------------------------------------------------
CREATE PRODUCT
POST /api/products/create
---------------------------------------------------------
*/
export const createProduct = async (req, res) => {
  try {
    const data = req.body;

    const sizes = data.sizes || [];
    const totalStock = sizes.reduce(
      (sum, s) => sum + (s.stock || 0),
      0
    );

    const product = await Product.create({
      ...data,
      totalStock,
    });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/*
---------------------------------------------------------
GET SINGLE PRODUCT
GET /api/products/:id
---------------------------------------------------------
*/
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/*
---------------------------------------------------------
GET PRODUCTS (Simple Version)
GET /api/products
---------------------------------------------------------
*/
export const getProductsSimple = async (req, res) => {
  try {
    const { category, collection, minPrice, maxPrice, sortBy, season, brand, sizes, colors } =
      req.query;
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

    const filters = [{ isActive: true }];

    const truthy = (v) => v === true || v === "true" || v === "1";
    if (truthy(req.query.isNewArrival)) filters.push({ isNewArrival: true });
    if (truthy(req.query.isFeatured)) filters.push({ isFeatured: true });
    if (truthy(req.query.isTrending)) filters.push({ isTrending: true });

    if (brand && String(brand).trim()) {
      filters.push({
        brand: new RegExp(escapeRegex(String(brand).trim()), "i"),
      });
    }

    if (sizes && String(sizes).trim()) {
      const sizeArr = String(sizes)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (sizeArr.length) filters.push({ "sizes.size": { $in: sizeArr } });
    }

    if (colors && String(colors).trim()) {
      const colorArr = String(colors)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (colorArr.length) filters.push({ colors: { $in: colorArr } });
    }

    if (collection) {
      const coll = String(collection).trim();
      if (
        mongoose.Types.ObjectId.isValid(coll) &&
        String(new mongoose.Types.ObjectId(coll)) === coll
      ) {
        filters.push({ collection: coll });
      } else {
        const colDoc = await Collection.findOne({
          slug: coll.toLowerCase(),
        })
          .select("_id")
          .lean();
        if (colDoc) {
          filters.push({ collection: colDoc._id });
        } else {
          return res.json({ success: true, products: [] });
        }
      }
    }

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category) && String(new mongoose.Types.ObjectId(category)) === String(category)) {
        filters.push({ category });
      } else {
        const catDoc = await Category.findOne({
          $or: [
            { name: new RegExp(`^${category}$`, "i") },
            { slug: String(category).toLowerCase() }
          ]
        }).select("_id").lean();

        if (catDoc) {
          filters.push({ category: catDoc._id });
        } else {
          return res.json({ success: true, products: [] });
        }
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const range = {};
      if (minPrice !== undefined && minPrice !== "") range.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== "") range.$lte = Number(maxPrice);
      filters.push({ price: range });
    }

    if (search) {
      const searchFilter = buildSearchFilter(search);
      if (searchFilter) filters.push(searchFilter);
    }

    if (season) {
      filters.push({
        $or: [
          { tags: { $regex: season, $options: "i" } },
          { name: { $regex: season, $options: "i" } }
        ]
      });
    }

    const query = filters.length === 1 ? filters[0] : { $and: filters };

    let sort = { createdAt: -1 };
    if (sortBy === "price-asc" || sortBy === "price-low") sort = { price: 1 };
    else if (sortBy === "price-desc" || sortBy === "price-high") sort = { price: -1 };
    else if (sortBy === "name" || sortBy === "name-asc") sort = { name: 1 };
    else if (sortBy === "name-desc") sort = { name: -1 };
    else if (sortBy === "oldest") sort = { createdAt: 1 };
    else if (sortBy === "newest") sort = { createdAt: -1 };
    else if (sortBy === "rating") sort = { rating: -1, numReviews: -1 };

    const products = await Product.find(query)
      .populate("category", "name slug")
      .select("name description price category collection brand images sizes colors totalStock isFeatured isNewArrival isTrending rating numReviews tags material careInstructions isActive createdAt")
      .sort(sort)
      .lean()
      .limit(500);

    res.json({
      success: true,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/*
---------------------------------------------------------
UPDATE PRODUCT
PUT /api/products/:id
---------------------------------------------------------
*/
export const updateProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/*
---------------------------------------------------------
DELETE PRODUCT
DELETE /api/products/:id
---------------------------------------------------------
*/
export const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};