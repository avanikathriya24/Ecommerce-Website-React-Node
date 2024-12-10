const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const db = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();

const secret = process.env.JWT_SECRET; 

const generateToken = (userId, username) => {
  const payload = { userId, username };
  return jwt.encode(payload, secret);
};

exports.signup = async (req, res) => {
  const { username, password, firstname, lastname } = req.body;

  console.log('Received data:', req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existingUser] = await db.execute('SELECT * FROM Users WHERE username = ?', [username]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const query = 'INSERT INTO Users (username, password, firstname, lastname) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(query, [username, hashedPassword, firstname, lastname]);

    const token = generateToken(result.insertId, username);

    res.status(201).json({
      message: 'User created successfully',
      token, 
    });
  } catch (err) {
    console.error('Error signing up user:', err);
    res.status(500).json({ message: 'Error signing up user' });
  }
};

exports.signin = async (req, res) => {
  const { username, password } = req.body;

  console.log('JWT Secret:', secret); 

  try {
    const [user] = await db.execute('SELECT * FROM Users WHERE username = ?', [username]);

    if (user.length === 0) {
      console.log('User not found in database:', username);
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      console.log('Password mismatch for user:', username);
      return res.status(400).json({ message: 'Invalid password' });
    }

    console.log('Password matched for user:', username);

    const token = generateToken(user[0].id, username);
    console.log('Generated token:', token);

    return res.json({
      message: 'Signin successful',
      token, 
    });
  } catch (err) {
    console.error('Error during signin process:', err); 
    return res.status(500).json({ message: 'Error signing in user', error: err.message || err }); // Send error message
  }
};



