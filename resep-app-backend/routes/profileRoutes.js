const express = require('express');
const { getProfile, updatePhoto } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware'); // Perbaiki import

const router = express.Router();

// Endpoint untuk mendapatkan profil
router.get('/', authMiddleware, getProfile);

// Endpoint untuk memperbarui foto
router.put('/photo', authMiddleware, updatePhoto);

module.exports = router;
