import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './Sign_up.css'; 

const Sign_up = ({ setAuthToken }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
  
    const { firstName, lastName, email, password, confirmPassword } = formData;
  
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
  
    const payload = {
      username: email, 
      password,
      firstname: firstName,
      lastname: lastName,
    };
  
    console.log('Sending payload:', payload); 
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', payload);
  
      if (response.data.token) {
        setAuthToken(response.data.token); 
        localStorage.setItem('token', response.data.token); 
        alert('Sign-up successful');
        navigate('/products');
      }
    } catch (error) {
      console.error('Error during sign-up:', error.response?.data || error.message); 
      setError(error.response?.data?.error || 'Something went wrong');
    }
  };
  

  return (
    <div className="sign-up-container">
      <h2 className="sign-up-title">Sign Up</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">First Name</label>
          <input
            className="input-field"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label className="input-label">Last Name</label>
          <input
            className="input-field"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label className="input-label">Email</label>
          <input
            className="input-field"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label className="input-label">Password</label>
          <input
            className="input-field"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label className="input-label">Confirm Password</label>
          <input
            className="input-field"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button className="submit-button" type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Sign_up;
