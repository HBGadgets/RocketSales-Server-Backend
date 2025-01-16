const mongoose = require('mongoose');

const superAdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: Number, default: 0 }, // 0 = Regular User, 1 = Admin, etc.
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Superadmin', superAdminSchema);

