const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // 1. Ambil token dari header Authorization
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing!' });
  }

  const token = authHeader.replace('Bearer ', ''); // Hilangkan 'Bearer '

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  // 2. Verifikasi token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Simpan data user dari token ke req.user
    req.user = decoded; 
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;