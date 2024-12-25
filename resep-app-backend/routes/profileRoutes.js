const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { requireAuth } = require('../middleware/authMiddleware');

// Mendapatkan data profile (membutuhkan autentikasi)
router.get('/', requireAuth, profileController.getProfile); // Periksa baris ini

// Update foto profile (membutuhkan autentikasi)
router.put('/photo', requireAuth, profileController.updatePhoto);

// Update data profile (name, email, password) (membutuhkan autentikasi)
router.put('/', requireAuth, profileController.updateProfile);

module.exports = router;