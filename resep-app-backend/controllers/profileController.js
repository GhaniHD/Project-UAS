const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt'); // Import bcrypt

// Konfigurasi multer untuk upload foto (pindahkan ke middleware/upload.js)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads/photo_profile');

    // Membuat direktori beserta subfolder jika belum ada
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating directory:', err);
        return cb(err, dir);
      }
      cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB limit
  },
}).single('photo');

// Mendapatkan data profil
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Memperbarui foto profil
exports.updatePhoto = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ message: 'File upload error: ' + err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    try {
      // Path relatif dari direktori 'uploads'
      const photoPath = 'photo_profile/' + req.file.filename;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { photo: photoPath },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ photo: user.photo });
    } catch (error) {
      console.error('Error in updatePhoto:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
};

// Memperbarui profil (name, email, password)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password } = req.body;

    // Validasi data
    if (!name || !email) {
      return res
        .status(400)
        .json({ message: 'Name and email are required!' });
    }

    const updateData = { name, email };

    // Hash password jika ada
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated', user });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};