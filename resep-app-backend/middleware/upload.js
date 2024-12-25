const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi penyimpanan multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user ? req.user.id : 'default';
    const dir = path.join(__dirname, `../uploads/photo_profile/${userId}`);

    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating directory:', err);
        return cb(err); // Hapus `dir` dari `cb(err, dir)`
      }
      cb(null, dir);
    });
  },
  filename: (req, file, cb) => {
    // Gunakan informasi user untuk membuat nama file yang lebih bermakna (opsional)
    const userPrefix = req.user ? req.user.id.substring(0, 8) + '-' : ''; // Ambil 8 karakter pertama dari userId, atau string kosong jika tidak ada
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, userPrefix + file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter file untuk hanya menerima file gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'), false);
  }
};

// Konfigurasi upload multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // Batas ukuran file 2MB
  },
});

module.exports = upload;