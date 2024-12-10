// /routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Route for user signup
router.post('/signup', authController.signup);

// Route for user signin (login)
router.post('/signin', authController.signin);

module.exports = router;

