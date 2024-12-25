const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware') // Jika digunakan untuk endpoint yang membutuhkan authentikasi

// Mendapatkan data profile
router.get('/', profileController.getProfile);

// Update foto profile
router.put('/photo', profileController.updatePhoto);

// Update data profile (name, email, password)
router.put('/', profileController.updateProfile); // Route baru untuk update profile

module.exports = router;