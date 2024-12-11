const Recipe = require('../models/Recipe');

exports.addRecipe = async (req, res) => {
  console.log('Request body:', req.body);
  try {
    const { title, description, servings, cookingTime, ingredients } = req.body;

    const recipeData = {
      title,
      description,
      servings: Number(servings),
      cookingTime: Number(cookingTime),
      ingredients: JSON.parse(ingredients),
      user: req.user.id,
    };

    if (req.file) {
      recipeData.image = `/uploads/${req.file.filename}`;
    }

    const newRecipe = new Recipe(recipeData);
    await newRecipe.save();

    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: 'Error creating recipe', error: err.message });
  }
};
