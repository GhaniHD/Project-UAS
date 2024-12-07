const express = require('express');
const { getAllRecipes, addRecipe } = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getAllRecipes);
router.post('/', authMiddleware, addRecipe);

module.exports = router;
