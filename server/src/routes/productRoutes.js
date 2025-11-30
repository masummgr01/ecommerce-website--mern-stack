const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');

const router = express.Router();

function slugify(name) {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');
}

// GET /api/products - list products (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// GET /api/products/admin - list all products (admin)
router.get('/admin', auth(true), requireAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Error fetching admin products', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// POST /api/products - create product (admin)
router.post('/', auth(true), requireAdmin, async (req, res) => {
  try {
    const { name, slug, description, price, images, category, brand, stockQty, isActive } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    let finalSlug = slug || slugify(name);
    const existing = await Product.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    const product = await Product.create({
      name,
      slug: finalSlug,
      description,
      price,
      images,
      category,
      brand,
      stockQty,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product', err);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// PUT /api/products/:id - update product (admin)
router.put('/:id', auth(true), requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Error updating product', err);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - soft delete (admin)
router.delete('/:id', auth(true), requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deactivated', product });
  } catch (err) {
    console.error('Error deleting product', err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// GET /api/products/:idOrSlug - product details
router.get('/:idOrSlug', async (req, res) => {
  const { idOrSlug } = req.params;

  try {
    const query =
      idOrSlug.match(/^[0-9a-fA-F]{24}$/) != null
        ? { _id: idOrSlug }
        : { slug: idOrSlug };

    const product = await Product.findOne({ ...query, isActive: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Error fetching product', err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

module.exports = router;
