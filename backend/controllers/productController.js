// /controllers/productController.js
const db = require('../config/db');
const path = require('path');

// Add new product
exports.addProduct = async (req, res) => {
  const { title, price, description, category, rate, count } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  // Validate incoming data
  if (!title || !price || !description || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Default values for rate and count if not provided
  const productRate = rate !== undefined ? rate : 0;  // Default rate to 0 if not provided
  const productCount = count !== undefined ? count : 0;  // Default count to 0 if not provided

  try {

    console.log('Received data:', { title, price, description, category, image: imagePath });

    const query = 'INSERT INTO Products (title, price, description, category, image, rate, count) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [
      title, price, description, category, imagePath, productRate, productCount
    ]);
    console.log('Product added:', result);


    res.json({
      id: result.insertId,
      title,
      price,
      description,
      category,
      image: imagePath,
      rate: productRate,
      count: productCount,
    });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ error: `Failed to add product: ${err.message}`, details: err.message });
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
