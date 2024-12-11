const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Wajib diisi
  },
  description: {
    type: String,
    required: true, // Wajib diisi
  },
  servings: {
    type: Number,
    required: true, // Wajib diisi
  },
  cookingTime: {
    type: Number,
    required: true, // Wajib diisi
  },
  ingredients: {
    type: [String], // Array of ingredients
    required: true, // Wajib diisi
  },
  image: {
    type: String, // Menyimpan path gambar jika ada
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referensi ke model User
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Waktu pembuatan
  },
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
