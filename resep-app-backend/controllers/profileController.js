const User = require('../models/User');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const multer = require('multer');

// Mendapatkan data profil
exports.getProfile = async (req, res) => { // Pastikan fungsi ini di-export
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
      const userId = req.user.id;
      const oldPhoto = req.user.photo;

      // Path relatif dari direktori 'uploads'
      const photoPath = req.file.path.replace(/\\/g, '/').split('uploads/')[1];

      const user = await User.findByIdAndUpdate(
        userId,
        { photo: `uploads/${photoPath}` },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Hapus foto lama jika ada dan bukan foto default
      if (
        oldPhoto &&
        !oldPhoto.startsWith('uploads/photo_profile/default')
      ) {
        const oldPhotoPath = path.join(__dirname, '../', oldPhoto);
        fs.unlink(oldPhotoPath, (err) => {
          if (err) {
            console.error('Error deleting old photo:', err);
          } else {
            console.log('Old photo deleted:', oldPhotoPath);
          }
        });
      }

      res.json({ photo: user.photo, user });
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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateData = {};

    if (name && name !== user.name) {
      updateData.name = name;
    }

    if (email && email !== user.email) {
      updateData.email = email;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({ message: 'No changes detected', user });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select('-password');

    res.status(200).json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};