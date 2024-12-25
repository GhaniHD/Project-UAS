const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
  },
  password: { type: String, required: true, minlength: 6 },
  photo: {
    type: String,
    default: path.join(
      __dirname,
      '..',
      'uploads',
      'photo_profile',
      'default.jpg'
    ),
  },
}, { timestamps: true });

// HASHING PASSWORD
// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();


//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

module.exports = mongoose.model('User', UserSchema);