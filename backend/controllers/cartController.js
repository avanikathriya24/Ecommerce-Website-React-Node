const db = require('../config/db');

// Add item to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user?.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: 'User not signed in' });
    }

    const [existingCart] = await db.execute(
      'SELECT * FROM Cart WHERE userId = ? AND productId = ?',
      [userId, productId]
    );

    if (existingCart.length > 0) {
      await db.execute(
        'UPDATE Cart SET quantity = quantity + ? WHERE userId = ? AND productId = ?',
        [quantity || 1, userId, productId]
      );
    } else {
      await db.execute(
        'INSERT INTO Cart (userId, productId, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity || 1]
      );
    }

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ message: 'Failed to add product to cart' });
  }
};

// Get cart for signed-in user
exports.getCart = async (req, res) => {
  const userId = req.user?.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: 'User not signed in' });
    }

    const [cartItems] = await db.execute(
      `SELECT Cart.id, Cart.quantity, Products.title, Products.price, Products.image 
       FROM Cart 
       JOIN Products ON Cart.productId = Products.id 
       WHERE Cart.userId = ?`,
      [userId]
    );

    res.json(cartItems);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ message: 'Failed to fetch cart items' });
  }
};
