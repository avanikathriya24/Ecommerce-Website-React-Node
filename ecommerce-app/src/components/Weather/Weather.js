import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './Search';
import { ClipLoader } from 'react-spinners';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiKey = 'e0d206a71dd641e550e37b8e68b2cb36';
  
  const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(2);  
  };


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        await fetchWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
      }, (err) => {
        setError('Failed to retrieve your location');
      });
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  const fetchWeatherByCoordinates = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );
      setWeather(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch weather data.');
      setLoading(false);
      setWeather(null);
    }
  };

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
      );
      setWeather(response.data);
      setLoading(false);
    } catch (err) {
      setError('City not found or API error');
      setLoading(false);
      setWeather(null);
    }
  };

  return (
    <div className="weather">
      <h1>Weather App</h1>
      <Search onSearch={fetchWeather} />

      {loading && <ClipLoader color="#0077b6" size={50} />}
      
      {error && <p>{error}</p>}
      
      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>{weather.weather[0].description}</p>
          <p>Temperature: {kelvinToCelsius(weather.main.temp)}°C</p> {/* Display temperature in Celsius */}
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
