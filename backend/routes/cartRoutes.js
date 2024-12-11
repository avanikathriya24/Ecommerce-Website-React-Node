const express = require('express');
const router = express.Router();
const authenticateJWT = require('./authenticateJWT'); // JWT middleware

// Sync cart (POST request)
router.post('/cart/sync', authenticateJWT, async (req, res) => {
  const { userId, cartItems } = req.body;

  if (!userId || !cartItems) {
    return res.status(400).json({ message: 'Missing userId or cartItems' });
  }

  try {
    // Example of how you might sync the cart items with the database
    const promises = cartItems.map(item => {
      return db.execute(
        'INSERT INTO cartItems (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = ?',
        [userId, item.productId, item.quantity, item.quantity]
      );
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    res.status(200).json({ message: 'Cart synced successfully' });
  } catch (error) {
    console.error('Error syncing cart with backend:', error);  // Log error details to the console
    res.status(500).json({ message: 'Error syncing cart with backend', error: error.message });
  }
});

// Fetch cart (GET request)
router.get('/cart', authenticateJWT, async (req, res) => {
  const userId = req.user.userId;  // Assuming userId is decoded from JWT

  try {
    const [cartItems] = await db.execute('SELECT * FROM cartItems WHERE user_id = ?', [userId]);
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart from backend:', error);  // Log error details to the console
    res.status(500).json({ message: 'Error fetching cart from backend', error: error.message });
  }
});

module.exports = router;
