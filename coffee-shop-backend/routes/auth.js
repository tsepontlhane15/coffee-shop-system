const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    const validUsername = process.env.STAFF_USERNAME || 'staff';
    const validPassword = process.env.STAFF_PASSWORD || 'staff123';

    if (username !== validUsername || password !== validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      staff: { username },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
});

module.exports = router;