const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Ensure uploads/photo_profile directory exists
const photoProfileDir = path.join(uploadsDir, 'photo_profile');
if (!fs.existsSync(photoProfileDir)) {
  fs.mkdirSync(photoProfileDir);
}

// --- Configuration for Profile Photos ---
const photoProfileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, photoProfileDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const photoProfileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed for profile photos'), false);
  }
};

const uploadPhotoProfile = multer({
  storage: photoProfileStorage,
  fileFilter: photoProfileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB file size limit for profile photos
  },
});

// --- Configuration for Recipe Photos ---
const photoRecipeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Langsung simpan di uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'recipe-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const photoRecipeFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed for recipe photos'), false);
  }
};

const uploadPhotoRecipe = multer({
  storage: photoRecipeStorage,
  fileFilter: photoRecipeFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit for recipe photos
  },
});

module.exports = {
  uploadPhotoProfile,
  uploadPhotoRecipe,
};