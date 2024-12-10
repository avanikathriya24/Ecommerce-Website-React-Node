// /routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');
const jwt = require('jwt-simple');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();
const secret = process.env.JWT_SECRET;  // Secret key for JWT

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Extract token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.decode(token, secret);  // Decode the token
    req.user = decoded;  // Attach the decoded user info to the request object
    next();  // Move to the next middleware (i.e., the controller)
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Upload files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Create a unique filename using timestamp
  },
});

const upload = multer({ storage });

// Route for adding a new product (protected by JWT authentication)
router.post('/products', authenticateJWT, upload.single('image'), productController.addProduct);

// Route for getting all products
router.get('/products', productController.getProducts);

module.exports = router;
