const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  servings: { type: Number, required: true },
  cookingTime: { type: Number, required: true },
  ingredients: { type: [String], required: true },
  image: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
