const db = require('../config/db');

// Helper function for executing a query with error handling
const executeQuery = async (query, params = []) => {
  try {
    const [rows] = await db.query(query, params);
    return rows;
  } catch (err) {
    throw new Error(`Database query error: ${err.message}`);
  }
};

// Fetches the cart items for a specific user
const getCart = async (userId) => {
  return executeQuery('SELECT * FROM cart WHERE user_id = ?', [userId]);
};

// Adds or updates items in the cart for a specific user
const addOrUpdateCart = async (userId, items) => {
  try {
    // Clear the existing cart for the user
    await executeQuery('DELETE FROM cart WHERE user_id = ?', [userId]);

    // Prepare and insert new cart items
    const values = items.map(item => [userId, item.itemId, item.quantity]);
    await executeQuery('INSERT INTO cart (user_id, item_id, quantity) VALUES ?', [values]);
  } catch (err) {
    throw new Error(`Error updating cart: ${err.message}`);
  }
};

// Clears the entire cart for a specific user
const clearCart = async (userId) => {
  return executeQuery('DELETE FROM cart WHERE user_id = ?', [userId]);
};

// Deletes a specific item from the cart for a specific user
const deleteCartItem = async (userId, itemId) => {
  try {
    const result = await executeQuery('DELETE FROM cart WHERE user_id = ? AND item_id = ?', [userId, itemId]);
    if (result.affectedRows === 0) {
      throw new Error('Item not found in the cart');
    }
  } catch (err) {
    throw new Error(`Error deleting item from cart: ${err.message}`);
  }
};

module.exports = {
  getCart,
  addOrUpdateCart,
  clearCart,
  deleteCartItem,
};
