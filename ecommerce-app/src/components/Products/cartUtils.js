// cartUtils.js
export const addToCartLocal = (productId, quantity = 1) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.productId === productId);
  
    if (index > -1) {
      cart[index].quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
  };
  
  export const getCartLocal = () => JSON.parse(localStorage.getItem('cart')) || [];
  