const db = require('../config/db');  // Your database connection (make sure it uses mysql2 with promises)

// Sync Cart with DB for Logged-in Users
exports.syncCart = async (req, res) => {
    try {
      const { userId, cartItems } = req.body;
  
      for (const item of cartItems) {
        const { productId, quantity } = item;
        const [existingItem] = await db.execute('SELECT * FROM CartItems WHERE user_id = ? AND product_id = ?', [userId, productId]);
  
        if (existingItem.length > 0) {
          await db.execute('UPDATE CartItems SET quantity = ? WHERE user_id = ? AND product_id = ?', [quantity, userId, productId]);
        } else {
          await db.execute('INSERT INTO CartItems (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, quantity]);
        }
      }
  
      res.status(200).json({ message: 'Cart synced successfully' });
    } catch (err) {
      console.error('Error syncing cart with database:', err);
      res.status(500).json({ message: 'Error syncing cart', error: err.message });
    }
  };
  

// Get Cart for Logged-in User
exports.getCart = async (req, res) => {
  const userId = req.user ? req.user.userId : null;

  if (!userId) {
    return res.status(403).json({ message: 'User not authenticated' });
  }

  try {
    const [cartItems] = await db.execute(
      'SELECT p.id, p.title, p.price, ci.quantity, p.image FROM CartItems ci JOIN products p ON ci.product_id = p.id WHERE ci.user_id = ?',
      [userId]
    );

    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};
