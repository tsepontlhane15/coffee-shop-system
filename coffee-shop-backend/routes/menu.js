const express = require('express');
const { redisClient } = require('../config/redis');
const { generateId } = require('../utils/generateId');
const { authenticateStaff } = require('../middleware/auth');

const router = express.Router();

// GET /api/menu - Get all menu items
router.get('/', async (req, res) => {
  try {
    const keys = await redisClient.keys('menu:*');

    if (!keys || keys.length === 0) {
      return res.json({ success: true, count: 0, data: [] });
    }

    const items = [];
    for (const key of keys) {
      const data = await redisClient.get(key);
      if (data) items.push(JSON.parse(data));
    }

    items.sort((a, b) => a.name.localeCompare(b.name));

    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve menu items' });
  }
});

// GET /api/menu/:id
router.get('/:id', async (req, res) => {
  try {
    const data = await redisClient.get(`menu:${req.params.id}`);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.json({ success: true, data: JSON.parse(data) });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve menu item' });
  }
});

// POST /api/menu (Staff only)
router.post('/', authenticateStaff, async (req, res) => {
  try {
    const { name, description, price, category, available = true, image } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, price and category are required',
      });
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a non-negative number',
      });
    }

    const id = generateId('menu');
    const menuItem = {
      id,
      name: name.trim(),
      description: description.trim(),
      price: Number(price.toFixed(2)),
      category: category.trim().toLowerCase(),
      available: Boolean(available),
      image: image || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await redisClient.set(`menu:${id}`, JSON.stringify(menuItem));

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem,
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create menu item',
    });
  }
});

// PUT /api/menu/:id (Staff only)
router.put('/:id', authenticateStaff, async (req, res) => {
  try {
    const existingData = await redisClient.get(`menu:${req.params.id}`);
    if (!existingData) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    const existing = JSON.parse(existingData);
    const { name, description, price, category, available, image } = req.body;

    const updatedItem = {
      ...existing,
      name: name !== undefined ? String(name).trim() : existing.name,
      description: description !== undefined ? String(description).trim() : existing.description,
      price: price !== undefined ? Number(Number(price).toFixed(2)) : existing.price,
      category: category !== undefined ? String(category).trim().toLowerCase() : existing.category,
      available: available !== undefined ? Boolean(available) : existing.available,
      image: image !== undefined ? image : existing.image,
      updatedAt: new Date().toISOString(),
    };

    if (isNaN(updatedItem.price) || updatedItem.price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid non-negative number',
      });
    }

    await redisClient.set(`menu:${req.params.id}`, JSON.stringify(updatedItem));

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    console.error('Error updating menu item:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update menu item',
      error: error.message,
    });
  }
});

// DELETE /api/menu/:id (Staff only)
router.delete('/:id', authenticateStaff, async (req, res) => {
  try {
    const existing = await redisClient.get(`menu:${req.params.id}`);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    await redisClient.del(`menu:${req.params.id}`);

    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ success: false, message: 'Failed to delete menu item' });
  }
});

module.exports = router;