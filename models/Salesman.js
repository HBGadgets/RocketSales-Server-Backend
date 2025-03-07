const mongoose = require('mongoose');
const { decrypt, encrypt } = require('../utils/cryptoUtils');
const { db1 }= require('../config/db'); 


const salesmanSchema = new mongoose.Schema({
  salesmanName: { type: String,},
  profileImage: { type: String, },
  salesmanEmail: { type: String, },
  salesmanPhone: { type: String,},
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Number, default: 0 }, 
  isLoggedIn: { type: Boolean, default: false }, 
  companyId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  supervisorId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' },
  
},{
  timestamps: true
});


salesmanSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = encrypt(this.password);
  }
  next();
});

salesmanSchema.methods.comparePassword = async function(password) {

  const decryptedPassword = decrypt(this.password);
  return password === decryptedPassword;
};


module.exports = db1.model('Salesman', salesmanSchema);