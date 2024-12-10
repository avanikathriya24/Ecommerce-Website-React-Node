import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './Navbar.css'; 

function Navbar({ loggedIn, handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">TODO</Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className="nav-link">PRODUCTS</Link>
          </li>
          <li className="nav-item">
            <Link to="/weather" className="nav-link">WEATHER</Link>
          </li>
        </ul>

        <div className="nav-links">
          {!loggedIn ? (
            <>
              <Link to="/sign_in" className="nav-link">Sign In</Link>
              <Link to="/sign_up" className="nav-link">Sign Up</Link>
            </>
          ) : (
            <div className="profile-menu">
              <Link to="/profile" className="nav-link">My Profile</Link>
              <button onClick={handleLogout} className="nav-link nav-button">Sign Out</button>
            </div>
          )}
        </div>

        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          &#9776;
        </button>
      </div>
    </nav>
  );
}


export default Navbar;
