// /middleware/authMiddleware.js
const jwt = require('jwt-simple');
const dotenv = require('dotenv');

dotenv.config();

const secret = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log('Received Token:', token); // Log the token for debugging purposes
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.decode(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticateJWT };
