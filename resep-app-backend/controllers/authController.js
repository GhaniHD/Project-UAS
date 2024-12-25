const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Fungsi untuk registrasi user
exports.register = async (req, res) => {
  try {
    console.log('Data diterima di backend:', req.body);
    console.log('File yang diterima di backend:', req.file);

    // Ambil Data User dari req.body.userData
    const userData = JSON.parse(req.body.userData); 

    // Validasi Data
    const { name, email, password } = userData; 

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required!' });
    }

    // Validasi: cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists!' });
    }

    // HASHING PASSWORD
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const hashedPassword = password; 

    // Handle Upload File (Jika Ada)
    let photoPath = null;
    if (req.file) {
      photoPath = 'uploads/photo_profile/' + req.file.filename;
    }

    // 5. Simpan User ke Database
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      photo: photoPath,
    });

    await newUser.save();

    // 6. Kirim Response Berhasil
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, message: 'Registration failed!' });
  }
};

// Fungsi untuk login user (tidak berubah)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password!' });
    }

    console.log('Login request received for:', email); // Tambahkan log ini
    console.log('Password Input:', password);
    console.log('Hashed Password di DB:', user.password);

    // HASHING PASSWORD
    // const isMatch = await bcrypt.compare(password, user.password);
    // console.log('Hasil bcrypt.compare:', isMatch);

    const isMatch = password === user.password;
    console.log('Hasil perbandingan password:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password!' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token });
  } catch (err) {
    console.error('Error di authController.login:', err);
    res.status(500).json({ error: err.message });
  }
};


// Fungsi untuk verifikasi token (Opsional)
exports.verifyToken = (req, res) => {
  res.status(200).json({ message: 'Token is valid', user: req.user });
};