const express = require('express');
const { redisClient } = require('../config/redis');
const { generateId } = require('../utils/generateId');
const { authenticateStaff } = require('../middleware/auth');

const router = express.Router();
const VALID_STATUSES = ['Pending', 'Preparing', 'Ready', 'Collected'];

// GET /api/orders (Staff only)
router.get('/', authenticateStaff, async (req, res) => {
  try {
    const keys = await redisClient.keys('order:*');

    if (!keys || keys.length === 0) {
      return res.json({ success: true, count: 0, data: [] });
    }

    let orders = [];
    for (const key of keys) {
      const data = await redisClient.get(key);
      if (data) orders.push(JSON.parse(data));
    }

    if (req.query.status) {
      if (!VALID_STATUSES.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        });
      }
      orders = orders.filter((o) => o.status === req.query.status);
    }

    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve orders' });
  }
});

// GET /api/orders/stats/daily (Staff only) - must be before /:id
router.get('/stats/daily', authenticateStaff, async (req, res) => {
  try {
    const keys = await redisClient.keys('order:*');
    const today = new Date().toISOString().split('T')[0];

    let totalOrders = 0;
    let totalRevenue = 0;
    const statusCount = { Pending: 0, Preparing: 0, Ready: 0, Collected: 0 };

    for (const key of keys) {
      const data = await redisClient.get(key);
      if (data) {
        const order = JSON.parse(data);
        if (order.createdAt.split('T')[0] === today) {
          totalOrders++;
          totalRevenue += order.total;
          if (statusCount[order.status] !== undefined) {
            statusCount[order.status]++;
          }
        }
      }
    }

    res.json({
      success: true,
      data: {
        date: today,
        totalOrders,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        statusBreakdown: statusCount,
      },
    });
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve daily stats' });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const data = await redisClient.get(`order:${req.params.id}`);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: JSON.parse(data) });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve order' });
  }
});

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { customerName, items, notes } = req.body;

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.menuItemId || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have menuItemId and quantity >= 1',
        });
      }

      const menuData = await redisClient.get(`menu:${item.menuItemId}`);
      if (!menuData) {
        return res.status(400).json({
          success: false,
          message: `Menu item ${item.menuItemId} not found`,
        });
      }

      const menuItem = JSON.parse(menuData);
      if (!menuItem.available) {
        return res.status(400).json({
          success: false,
          message: `"${menuItem.name}" is currently unavailable`,
        });
      }

      const quantity = Math.floor(item.quantity);
      const subtotal = Number((menuItem.price * quantity).toFixed(2));
      total += subtotal;

      orderItems.push({
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        subtotal,
      });
    }

    const id = generateId('order');
    const order = {
      id,
      customerName: customerName.trim(),
      items: orderItems,
      notes: notes ? notes.trim() : '',
      total: Number(total.toFixed(2)),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await redisClient.set(`order:${id}`, JSON.stringify(order));

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

// PATCH /api/orders/:id/status (Staff only)
router.patch('/:id/status', authenticateStaff, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const existingData = await redisClient.get(`order:${req.params.id}`);
    if (!existingData) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = JSON.parse(existingData);
    order.status = status;
    order.updatedAt = new Date().toISOString();

    await redisClient.set(`order:${req.params.id}`, JSON.stringify(order));

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

module.exports = router;