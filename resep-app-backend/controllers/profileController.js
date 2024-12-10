const User = require('../models/User');

// Mendapatkan data profil
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Memperbarui foto profil
exports.updatePhoto = async (req, res) => {
  const { photo } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { photo },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ photo: user.photo });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
