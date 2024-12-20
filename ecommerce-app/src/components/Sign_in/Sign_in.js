import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './Sign_in.css'; 

const Sign_in = ({ setAuthToken }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    const { email, password } = formData;
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', {
        username: email,
        password: password,
      });
  
      if (response.data.token) {
        setAuthToken(response.data.token); 
        localStorage.setItem('token', response.data.token); 
        console.log(localStorage.getItem('token'))


        alert('Login successful');
        navigate('/products'); 
      }
    } catch (error) {
      console.error('Error response:', error); 
  
      if (error.response) {
        setError(error.response.data.message || 'Something went wrong');
      } else if (error.request) {
        setError('No response from server');
      } else {
        setError(error.message || 'An unexpected error occurred');
      }
    }
  };
   

  return (
    <div className="sign-in-container">
      <h2 className="sign-in-heading">Sign In</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="sign-in-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Sign In</button>
      </form>
    </div>
  );
};

export default Sign_in;
