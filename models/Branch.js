const mongoose = require('mongoose');
const { decrypt, encrypt } = require('../utils/cryptoUtils');




const branchSchema = new mongoose.Schema({
     branchName: { type: String, required: true },
     branchLocation: { type: String, required: true },
     branchEmail: { type: String, sparse: true,},
     branchPhone: { type: String, required: false }, 
     supervisorsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' }], 
     username: { type: String, required: true, unique: true,sparse: true, },
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


   module.exports = mongoose.model('Branch', branchSchema);
