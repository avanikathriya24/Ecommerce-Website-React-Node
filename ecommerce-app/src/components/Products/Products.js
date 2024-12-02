import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from './CartContex';
import './Product.css';

// Fetch products from the new API (your backend)
const fetchProducts = async () => {
  const response = await fetch('http://localhost:5000/api/products'); // Update with your backend API URL
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  let imageSrc = product.image || 'default-placeholder.jpg';  // Fallback if image is null

  return (
    <div className="product-card">
      {/* Show image from base64 or URL */}
      <img src={imageSrc} alt={product.title} />
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <div className="product-rating">
          <div className="stars">
            {Array.from({ length: 5 }, (_, index) => (
              <FaStar
                key={index}
                color={index < Math.floor(product.rate) ? '#ff9900' : '#e4e5e9'}
              />
            ))}
          </div>
        </div>
        <span>{product.rate} ({product.count} reviews)</span>
        <p className="product-price">${product.price}</p>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false); // To show/hide the add product form
  const [newProductStatus, setNewProductStatus] = useState(null); // Status of the new product
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: null,
  });
  
  // Notification state for product added
  const [showAddToCartNotification, setShowAddToCartNotification] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data); // Set all products initially
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  // Handle form data changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure price is a valid number
    const price = parseFloat(formData.price);
  
    if (isNaN(price)) {
      alert('Please enter a valid price');
      return;
    }
  
    const productRate = 0; // Default rating value
  
    const newFormData = new FormData();
    newFormData.append('title', formData.title);
    newFormData.append('price', price);  // Valid price value
    newFormData.append('description', formData.description);
    newFormData.append('category', formData.category);
    newFormData.append('rate', productRate);  // Append rate value (could be dynamically set)
  
    // Append the image file if it's available
    if (formData.image) {
      newFormData.append('image', formData.image);
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: newFormData, // Sending the form data including the image
      });
  
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
  
      const addedProduct = await response.json();
      setNewProductStatus(`Product added successfully: ${addedProduct.title} (ID: ${addedProduct.id})`);
  
      // Update the products and filteredProducts arrays to include the newly added product
      setProducts((prevProducts) => [...prevProducts, addedProduct]);
      setFilteredProducts((prevFilteredProducts) => [...prevFilteredProducts, addedProduct]);
  
      // Reset the form data
      setFormData({
        title: '',
        price: '',
        description: '',
        category: '',
        image: null,
      });
      setShowForm(false); // Close the form after submitting
    } catch (error) {
      setNewProductStatus('Error adding product');
      console.error(error); // Log the error for debugging
    }
  };

  // Handle Add to Cart
  const handleAddToCart = (product) => {
    addToCart(product); // Call the context's addToCart method
    setShowAddToCartNotification(true); // Show notification
    setTimeout(() => setShowAddToCartNotification(false), 3000); // Hide after 3 seconds
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file, // Store the actual file here for uploading
    }));
  };

  // Filter products by category
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);

    if (category === '') {
      setFilteredProducts(products); // Show all products
    } else {
      const filtered = products.filter((product) => product.category === category);
      setFilteredProducts(filtered); // Filter products
    }
  };

  const getCartCount = () => {
    return cart.reduce((count, product) => count + product.quantity, 0);  // Sum up the quantities
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="product-page">
      <div className="header">
        <div className="filter-cart-container">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-select"
          >
            <option value="">All Categories</option>
            <option value="men's clothing">Men's Clothing</option>
            <option value="women's clothing">Women's Clothing</option>
            <option value="jewelery">Jewelry</option>
            <option value="electronics">Electronics</option>
          </select>

          <div className="cart">
            <a href="/cart">
              <FontAwesomeIcon icon={faShoppingCart} />
              <span>{getCartCount()}</span>
            </a>
            
          </div>
        </div>
        {showAddToCartNotification && (
              <div className="cart-notification">Product added to cart!</div>
            )}

        <button onClick={() => setShowForm(true)} className="add-product-btn">
          Add New Product
        </button>
        {newProductStatus && <p>{newProductStatus}</p>}
      </div>

      {showForm && (
        <div className="add-product-form">
          <h3>Add a New Product</h3>
          <form className='f1' onSubmit={handleSubmit}>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Category:
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Image:
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {formData.image && <img src={URL.createObjectURL(formData.image)} alt="Product Preview" width="100" />}
            </label>
            <button type="submit">Add Product</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}

      <h1>Our Products</h1>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
