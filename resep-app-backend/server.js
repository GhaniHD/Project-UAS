const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const profileRoutes = require('./routes/profileRoutes');
const path = require('path');
const favoriteRoutes = require('./routes/favoriteRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const fs = require('fs');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Buat direktori uploads dan photo_profile jika belum ada
const uploadsDir = path.join(__dirname, 'uploads');
const photoProfileDir = path.join(uploadsDir, 'photo_profile');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(photoProfileDir)) {
  fs.mkdirSync(photoProfileDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rute untuk login dan register
app.use('/auth', authRoutes);

// Rute untuk profil (perlu auth)
app.use('/profile', authMiddleware, profileRoutes);

// Route untuk recipes dengan selective auth
app.use('/recipes', (req, res, next) => {
  // Skip auth middleware untuk endpoint public
  if (req.path === '/public') {
    return next();
  }
  // Terapkan auth middleware untuk route lainnya
  return authMiddleware(req, res, next);
}, recipeRoutes);

// Route untuk favorites
app.use('/favorites', favoriteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));