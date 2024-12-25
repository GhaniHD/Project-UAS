const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // Import upload middleware

// Endpoint untuk registrasi (dengan upload foto, jika diperlukan)
router.post('/register', upload.single('photo'), authController.register);

// Endpoint untuk login
router.post('/login', authController.login);

// Endpoint untuk verifikasi token (opsional, jika diperlukan)
router.post('/verify-token', authMiddleware, authController.verifyToken);

module.exports = router;