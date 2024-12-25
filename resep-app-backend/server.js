const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const profileRoutes = require('./routes/profileRoutes');
const path = require('path');
const favoriteRoutes = require('./routes/favoriteRoutes');
const { requireAuth } = require('./middleware/authMiddleware'); // Destructure requireAuth

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Use body-parser for parsing JSON
// app.use(express.json()); // Redundant with body-parser

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rute untuk login dan register
app.use('/auth', authRoutes);

// Rute untuk profil (perlu auth) - Using the correct middleware
app.use('/profile', requireAuth, profileRoutes);

// Route untuk recipes dengan selective auth
app.use('/recipes', (req, res, next) => {
    // Check for specific public endpoints under /recipes
    const publicEndpoints = ['/public', '/public/:recipeId']; // Add more public endpoints as needed
    if (publicEndpoints.includes(req.path)) {
        return next();
    }
    // Terapkan auth middleware untuk route lainnya
    return requireAuth(req, res, next);
}, recipeRoutes);


// Route untuk favorites (perlu auth)
app.use('/favorites', requireAuth, favoriteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));