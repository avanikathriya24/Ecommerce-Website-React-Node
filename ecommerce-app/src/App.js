import React, { useState } from 'react';
import Todo from './components/Todo/Todo';
import Navbar from './components/Navbar/Navbar';
import Weather from './components/Weather/Weather';
import Products from './components/Products/Products';
import Cart from './components/Products/CartPage';
import { CartProvider } from './components/Products/CartContex';
import Sign_in from './components/Sign_in/Sign_in';
import Sign_up from './components/Sign_up/Sign_up';



import { BrowserRouter,Route, Routes } from 'react-router-dom';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [loggedIn, setLoggedIn] = useState(!!authToken);

  const handleSetAuthToken = (token) => {
    setAuthToken(token);
    localStorage.setItem('token', token);
    setLoggedIn(true); // Update loggedIn state on successful login
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('token');
    setLoggedIn(false); // Update loggedIn state on logout
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar loggedIn={loggedIn} handleLogout={handleLogout} />
        <CartProvider>
          <Routes>
            <Route path="/" element={<Todo />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/sign_in" element={<Sign_in setAuthToken={handleSetAuthToken} />} />
            <Route path="/sign_up" element={<Sign_up setAuthToken={handleSetAuthToken} />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </div>
  );
}


export default App;
