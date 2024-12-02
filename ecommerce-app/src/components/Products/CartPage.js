import React from 'react';
import { useCart } from './CartContex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart, removeAllFromCart, updateQuantity } = useCart();

  // Calculate subtotal by summing the price * quantity for each item
  const calculateSubtotal = () => {
    return cart.reduce((subtotal, product) => subtotal + product.price * product.quantity, 0).toFixed(2);
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);  // Removes product from cart
  };

  const handleRemoveAll = () => {
    removeAllFromCart();  // Clears all products from cart
  };

  const handleQuantityChange = (productId, event) => {
    const newQuantity = parseInt(event.target.value);
    updateQuantity(productId, newQuantity); // Updates the quantity
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>  // Shows empty message if cart is empty
      ) : (
        <>
          <button onClick={handleRemoveAll} className="remove-all-btn">
            Empty cart
          </button>
          <div className="cart-items">
            {cart.map((product) => (
              <div key={product.id} className="cart-item">
                <img src={product.image} alt={product.title} />
                <div className="cart-item-info">
                  <h3>{product.title}</h3>
                  <p>${product.price}</p>
                  {/* Quantity dropdown */}
                  <select 
                    value={product.quantity} 
                    onChange={(e) => handleQuantityChange(product.id, e)}
                    className="quantity-select"
                  >
                    {[...Array(10).keys()].map(i => (
                      <option key={i+1} value={i+1}>{i+1}</option> // Create options from 1 to 10
                    ))}
                  </select>
                  <p>Total: ${product.price * product.quantity}</p>
                </div>
                <button onClick={() => handleRemove(product.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
          <div className="cart-subtotal">
            <h3>Subtotal: ${calculateSubtotal()}</h3> {/* Display subtotal */}
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
