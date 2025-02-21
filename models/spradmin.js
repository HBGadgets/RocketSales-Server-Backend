const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/cryptoUtils');
const { db1 }= require('../config/db'); 


const superAdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});


superAdminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = encrypt(this.password);
  }
  next();
});

superAdminSchema.methods.comparePassword = async function(password) {

  const decryptedPassword = decrypt(this.password);
  return password === decryptedPassword;
};


module.exports = db1.model('Superadmin', superAdminSchema);
// module.exports = mongoose.model('Superadmin', superAdminSchema);
