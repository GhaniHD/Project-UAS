const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

const authMiddleware = require('./middleware/authMiddleware'); // Import middleware otentikasi

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rute untuk login dan register
app.use('/auth', authRoutes);


// Rute untuk recipes (hanya bisa diakses jika sudah login)
app.use('/recipes', authMiddleware, recipeRoutes); // Menambahkan authMiddleware di sini

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
