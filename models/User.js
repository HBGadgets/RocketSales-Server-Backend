const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Number, default: 0 }, // 0 = Regular User, 1 = Admin, etc.
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
