// /routes/productRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');
const jwt = require('jwt-simple');
const { authenticateJWT } = require('../middleware/authMiddleware');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  
  },
});

const upload = multer({ storage });

router.post('/products', authenticateJWT, upload.single('image'), productController.addProduct);

router.get('/products', productController.getProducts);

module.exports = router;
