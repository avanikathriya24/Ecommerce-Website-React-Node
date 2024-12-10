// /controllers/productController.js
const db = require('../config/db');
const path = require('path');

// Add new product
exports.addProduct = async (req, res) => {
  const { title, price, description, category } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const query = 'INSERT INTO Products (title, price, description, category, image) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [title, price, description, category, imagePath]);

    res.json({ id: result.insertId, title, price, description, category, image: imagePath });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM Products');
    res.json(results);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
