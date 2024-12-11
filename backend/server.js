
// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT || 5000;


dotenv.config();
const corsOptions = {
  origin: 'http://localhost:3000',  // React app origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],  // Include Authorization header
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
// app.use(cors());             
app.use(express.json());     
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  

app.use('/api/auth', authRoutes);   
app.use('/api', productRoutes);  
app.use('/api', cartRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
