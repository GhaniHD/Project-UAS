const Recipe = require('../models/Recipe');

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('user', 'email');
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addRecipe = async (req, res) => {
  const { title, description, ingredients, steps } = req.body;
  try {
    const recipe = new Recipe({ title, description, ingredients, steps, user: req.user.id });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
