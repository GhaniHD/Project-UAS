const Recipe = require('../models/Recipe');

// Get all public recipes (tanpa auth)
exports.getAllPublicRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate('user', 'name') 
      .sort({ createdAt: -1 });
    
    const recipesWithFullUrls = recipes.map(recipe => ({
      id: recipe._id,
      title: recipe.title,
      description: recipe.description,
      servings: recipe.servings,
      cookingTime: recipe.cookingTime,
      ingredients: recipe.ingredients,
      imageUrl: recipe.image 
        ? `${req.protocol}://${req.get('host')}${recipe.image}`
        : null,
      author: recipe.user?.name || 'Anonymous', // Handle jika tidak ada user
      createdAt: recipe.createdAt
    }));

    res.status(200).json({
      success: true,
      recipes: recipesWithFullUrls
    });
  } catch (error) {
    console.error('Error fetching public recipes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public recipes',
      error: error.message
    });
  }
};

// Get recipes untuk user yang login
exports.getAllRecipes = async (req, res) => {
  try {
    // Ambil recipes berdasarkan user yang sedang login
    const recipes = await Recipe.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    const recipesWithFullUrls = recipes.map(recipe => ({
      id: recipe._id,
      title: recipe.title,
      description: recipe.description,
      servings: recipe.servings,
      cookingTime: recipe.cookingTime,
      ingredients: recipe.ingredients,
      imageUrl: recipe.image 
        ? `${req.protocol}://${req.get('host')}${recipe.image}`
        : null,
      createdAt: recipe.createdAt,
      userId: recipe.user
    }));

    res.status(200).json({
      success: true,
      recipes: recipesWithFullUrls
    });
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipes',
      error: error.message
    });
  }
};

// Add new recipe
exports.addRecipe = async (req, res) => {
  try {
    const { title, description, servings, cookingTime, ingredients } = req.body;

    // Validate required fields
    if (!title || !description || !ingredients) {
      return res.status(400).json({ 
        message: 'Please provide title, description, and ingredients' 
      });
    }

    const recipeData = {
      title,
      description,
      servings: Number(servings),
      cookingTime: Number(cookingTime),
      ingredients: JSON.parse(ingredients),
      user: req.user.id
    };

    if (req.file) {
      recipeData.image = `/uploads/${req.file.filename}`;
    }

    const newRecipe = new Recipe(recipeData);
    await newRecipe.save();

    res.status(201).json({ 
      message: 'Recipe added successfully', 
      recipe: newRecipe 
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(400).json({ 
      message: 'Error creating recipe', 
      error: error.message 
    });
  }
};

// Update recipe
exports.updateRecipe = async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check ownership
    if (recipe.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    const { title, description, servings, cookingTime, ingredients } = req.body;
    
    const updateData = {
      title,
      description,
      servings: Number(servings),
      cookingTime: Number(cookingTime),
      ingredients: JSON.parse(ingredients)
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({ 
      message: 'Recipe updated successfully', 
      recipe 
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ 
      message: 'Error updating recipe', 
      error: error.message 
    });
  }
};

// Delete recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check ownership
    if (recipe.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ 
      message: 'Error deleting recipe', 
      error: error.message 
    });
  }
};