const Recipe = require('../models/Recipe'); // Model resep
const multer = require('multer'); // Untuk menangani file upload

// Fungsi untuk menambahkan resep
exports.addRecipe = async (req, res) => {
  try {
    // Memeriksa apakah body request sudah diterima dengan benar
    console.log('Request body:', req.body); // Memeriksa seluruh data yang diterima
    const { title, description, servings, cookingTime, ingredients } = req.body;

    // Menampilkan data yang diterima
    console.log('Received data:', { title, description, servings, cookingTime, ingredients });

    // Mengonversi data yang diterima menjadi tipe yang sesuai
    const recipeData = {
      title,
      description,
      servings: Number(servings), // Mengonversi servings menjadi angka
      cookingTime: Number(cookingTime), // Mengonversi cookingTime menjadi angka
      ingredients: JSON.parse(ingredients), // Mengonversi ingredients menjadi array
      user: req.user.id, // Menyimpan ID pengguna dari token
    };

    // Jika ada file gambar, menyimpannya di dalam field image
    if (req.file) {
      console.log('File uploaded:', req.file); // Menampilkan data file yang di-upload
      recipeData.image = `/uploads/${req.file.filename}`; // Menyimpan path gambar
    }

    // Membuat objek resep baru berdasarkan data yang sudah diproses
    const newRecipe = new Recipe(recipeData);

    // Menyimpan resep baru ke database
    await newRecipe.save();
    console.log('Recipe saved:', newRecipe); // Menampilkan resep yang berhasil disimpan

    // Mengirim response jika berhasil
    res.status(201).json({ message: 'Recipe added successfully', recipe: newRecipe }); // Mengirimkan data resep yang baru disimpan
  } catch (err) {
    console.error('Error creating recipe:', err); // Menampilkan error yang terjadi
    res.status(400).json({ message: 'Error creating recipe', error: err.message }); // Mengirimkan error
  }
};
