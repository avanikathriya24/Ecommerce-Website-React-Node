import React, { useState } from 'react';
import './Search.css';

const Search = ({ onSearch }) => {
  const [city, setCity] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(city);  // Sends the city to the parent component (App) to fetch data
  };

  return (
    <div className="search-container">
      <form className='f2' onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          value={city}
          onChange={(e) => setCity(e.target.value)} // Tracks user input
          placeholder="Enter city"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
    </div>
  );
};

export default Search;
