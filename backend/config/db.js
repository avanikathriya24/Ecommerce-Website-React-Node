// /config/db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables from .env

// MySQL connection configuration
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;  // Export the connection pool
