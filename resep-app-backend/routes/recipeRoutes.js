const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); // Menambahkan path untuk menangani jalur file
const { addRecipe } = require('../controllers/recipeController');

// Setup multer untuk menangani upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Menyimpan file ke folder 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Menambahkan timestamp pada nama file dan ekstensi file
  },
});

const upload = multer({ storage: storage });

// Route untuk menambahkan resep, dengan upload gambar
router.post('/', upload.single('image'), addRecipe);

module.exports = router;
