const express = require('express');
const router = express.Router();

let recipes = [
  {
    _id: '1',
    title: 'Nasi Goreng',
    description: 'Nasi goreng spesial dengan telur',
    servings: 2,
    cookingTime: 15,
    ingredients: ['Nasi', 'Telur', 'Kecap', 'Bawang Merah'],
    image: 'https://via.placeholder.com/150',
  },
  {
    _id: '2',
    title: 'Mie Goreng',
    description: 'Mie goreng lezat dengan sayuran',
    servings: 1,
    cookingTime: 10,
    ingredients: ['Mie', 'Sayur', 'Kecap'],
    image: 'https://via.placeholder.com/150',
  },
];

// GET /recipes - Mendapatkan semua resep
router.get('/', (req, res) => {
  res.status(200).json(recipes);
});

// POST /recipes - Menambahkan resep baru
router.post('/', (req, res) => {
  const { title, ingredients, description, servings, cookingTime, image } = req.body;

  // Validasi input
  if (!title || !ingredients || ingredients.length === 0) {
    return res.status(400).json({ message: 'Nama resep dan bahan-bahan wajib diisi.' });
  }

  const newRecipe = {
    _id: (recipes.length + 1).toString(),
    title,
    description,
    servings,
    cookingTime,
    ingredients,
    image, // Bisa menambahkan validasi jika ada image
  };

  recipes.push(newRecipe);
  res.status(201).json({ message: 'Recipe added successfully', recipe: newRecipe });
});
module.exports = router;
