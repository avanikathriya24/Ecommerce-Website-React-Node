import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import your CSS file

function Navbar() {
  const [menuActive, setMenuActive] = useState(false);

  // Toggle menu visibility
  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Navbar Links */}
        <ul className={`nav-menu ${menuActive ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link">TODO LIST</Link>
          </li>
          <li className="nav-item">
            <Link to="/weather" className="nav-link">WEATHER</Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className="nav-link">PRODUCTS</Link>
          </li>
          
   
        </ul>

          <button className="nav-toggle" onClick={toggleMenu}>
          &#9776; {/* Hamburger icon */}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
