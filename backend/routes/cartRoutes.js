const express = require('express');
const { addToCart, getCart } = require('../controllers/cartController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/cart', authenticateJWT, addToCart);
router.get('/cart', authenticateJWT, getCart);

module.exports = router;
