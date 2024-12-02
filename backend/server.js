const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

// MySQL Connection
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


// Add new product
app.post('/api/products', upload.single('image'), (req, res) => {
  const { title, price, description, category } = req.body;
  const image = req.file ? req.file.buffer : null; 

  const query = 'INSERT INTO Product (title, price, description, category, image) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [title, price, description, category, image], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to add product' });
    }
    res.json({ id: result.insertId, title, price, description, category, image: null });
  });
});

// Get all products (with images)
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM Product', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    const productsWithImages = results.map((product) => {
      const base64Image = product.image
        ? `data:image/jpeg;base64,${Buffer.from(product.image).toString('base64')}`
        : null;
      return {
        ...product,
        image: base64Image,
      };
    });
    res.json(productsWithImages);
  });
});

// Server Listen
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
