const express = require('express');
const router = express.Router();
const { getAllRecipes, addRecipe } = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware');

// Rute publik (tidak perlu login)
router.get('/public', (req, res) => res.json({ message: 'Public route, no authentication needed' }));

// Rute privat (hanya bisa diakses setelah login)
router.get('/', authMiddleware, getAllRecipes);
router.post('/', authMiddleware, addRecipe);

module.exports = router;
