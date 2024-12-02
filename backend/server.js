const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 

// Create 'images' directory if it doesn't exist
const imageDir = path.join(__dirname, 'images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}

// Set up multer to store images in 'images/' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDir); // Store images in 'images/' folder
  },
  filename: (req, file, cb) => {
    // Use the original filename with a timestamp to avoid conflicts
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, Date.now() + ext); // Save as a unique filename
  }
});

const upload = multer({ storage: storage });

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce_db',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Serve images statically
app.use('/images', express.static(imageDir));

// Add a new product with image
app.post('/api/products', upload.single('image'), (req, res) => {
  const { title, price, description, category } = req.body;
  const image = req.file ? `/images/${req.file.filename}` : null; // Store image path in DB

  // SQL query to insert the new product
  const query = 'INSERT INTO Product (title, price, description, category, image) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [title, price, description, category, image], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to add product' });
    }
    res.json({
      id: result.insertId,
      title,
      price,
      description,
      category,
      image, // Send back the image URL
    });
  });
});

// Get all products (with image URLs)
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM Product', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(results); // The image field will contain the URL (e.g., /images/sample.jpg)
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
