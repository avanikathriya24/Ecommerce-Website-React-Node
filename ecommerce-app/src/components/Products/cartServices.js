// cartService.js
import { addToCartLocal, getCartLocal } from '../Products/cartUtils';

const API_BASE_URL = 'http://localhost:5000/api';

export const addToCart = async (productId, quantity = 1) => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        console.log('Product added to cart successfully');
      } else {
        console.error('Failed to add product to cart:', await response.json());
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  } else {
    addToCartLocal(productId, quantity);
    console.log('Product added to local cart');
  }
};

export const fetchCart = async () => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const cart = await response.json();
        console.log('User Cart:', cart);
        return cart;
      } else {
        console.error('Failed to fetch cart:', await response.json());
        return [];
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      return [];
    }
  } else {
    const cart = getCartLocal();
    console.log('Guest Cart:', cart);
    return cart;
  }
};