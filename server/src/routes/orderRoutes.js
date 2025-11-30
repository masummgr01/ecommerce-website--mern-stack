const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// POST /api/orders - create order
router.post('/', auth(false), async (req, res) => {
  try {
    const { items, customerInfo, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      return res.status(400).json({ message: 'Customer information is required' });
    }

    if (!total || total <= 0) {
      return res.status(400).json({ message: 'Valid total amount is required' });
    }

    // Verify products exist and check stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product} not found` });
      }
      if (product.stockQty !== undefined && product.stockQty < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
    }

    const order = await Order.create({
      user: req.user?.id || null,
      items,
      customerInfo,
      total,
      status: 'pending',
      paymentStatus: 'pending',
    });

    res.status(201).json({ order });
  } catch (err) {
    console.error('Error creating order', err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// GET /api/orders - get user's orders
router.get('/', auth(true), async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id - get single order
router.get('/:id', auth(false), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user && order.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (err) {
    console.error('Error fetching order', err);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// PUT /api/orders/:id/status - update order status (admin)
router.put('/:id/status', auth(true), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('Error updating order status', err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

module.exports = router;
