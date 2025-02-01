const mongoose = require('mongoose');
const { decrypt, encrypt } = require('../utils/cryptoUtils');

const salesmanSchema = new mongoose.Schema({
  salesmanName: { type: String, required: true },
  profileImage: { type: String, },
  salesmanEmail: { type: String,sparse: true, },
  salesmanPhone: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Number, default: 0 }, 
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


module.exports = mongoose.model('Salesman', salesmanSchema);