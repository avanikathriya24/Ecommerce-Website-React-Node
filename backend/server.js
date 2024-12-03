const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create 'uploads' folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); 
  },
});

const upload = multer({ storage: storage });

// // MySQL Connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'ecommerce_db',
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     process.exit(1);
//   }
//   console.log('Connected to MySQL');
// });

// // Add new product
// app.post('/api/products', upload.single('image'), (req, res) => {
//   const { title, price, description, category } = req.body;
//   const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

//   const query = 'INSERT INTO Product (title, price, description, category, image) VALUES (?, ?, ?, ?, ?)';
//   db.query(query, [title, price, description, category, imagePath], (err, result) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ error: 'Failed to add product' });
//     }
//     res.json({ id: result.insertId, title, price, description, category, image: imagePath });
//   });
// });

// // Get all products (with image paths)
// app.get('/api/products', (req, res) => {
//   db.query('SELECT * FROM Product', (err, results) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ error: 'Failed to fetch products' });
//     }
//     res.json(results); 
//   });
// });



// MySQL Connection using promise API

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.post('/api/products', upload.single('image'), async (req, res) => {
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
});

app.get('/api/products', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM Products');
    res.json(results); 
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Server Listen
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
