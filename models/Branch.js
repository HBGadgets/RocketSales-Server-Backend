const mongoose = require('mongoose');
const { decrypt, encrypt } = require('../utils/cryptoUtils');
const { db1 }= require('../config/db'); 



const branchSchema = new mongoose.Schema({
     branchName: { type: String, },
     branchLocation: { type: String,},
     branchEmail: { type: String,},
     branchPhone: { type: String, }, 
     supervisorsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' }], 
     username: { type: String, required: true, unique: true, },
     password: { type: String, required: true },
     role: { type: Number, default: 0 }, 
     companyId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    },
   {
     timestamps: true
   });

   
   branchSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = encrypt(this.password);
  }
  next();
});

branchSchema.methods.comparePassword = async function(password) {

  const decryptedPassword = decrypt(this.password);
  return password === decryptedPassword;
};


   module.exports = db1.model('Branch', branchSchema);
