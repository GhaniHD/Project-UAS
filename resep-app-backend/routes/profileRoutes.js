const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth'); // Pastikan middleware auth sudah benar

// Mendapatkan data profil
router.get('/', authenticateToken, profileController.getProfile);

// Memperbarui foto profil
router.put('/photo', authenticateToken, profileController.updatePhoto);

// Memperbarui profil (name, email, password)
router.put('/', authenticateToken, profileController.updateProfile);

module.exports = router;