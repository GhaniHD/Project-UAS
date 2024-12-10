const express = require('express');
const { getProfile, updatePhoto } = require('../controllers/profileController');
const authMiddleware = require('../');

const router = express.Router();

router.get('/', authMiddleware, getProfile); // Endpoint untuk mendapatkan profil
router.put('/photo', authMiddleware, updatePhoto); // Endpoint untuk memperbarui foto

module.exports = router;
