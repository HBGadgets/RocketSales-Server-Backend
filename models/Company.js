// //models/Company.js
const mongoose = require('mongoose');
const { decrypt, encrypt } = require('../utils/cryptoUtils');


const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },  
  companyEmail: { type: String },   
  companyPhone: { type: String, required: false},               
  ownerName: { type: String, required: true },     
  ownerEmail: { type: String,required: true },                    
  gstNo: { type: String },         
  panNo: { type: String },                         
  businessType: { type: String },                  
  branchesIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }],                        
  username: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },  
  role: { type: Number, default: 0 }, 

}, {
  timestamps: true
});


companySchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = encrypt(this.password);
  }
  next();
});

companySchema.methods.comparePassword = async function(password) {

  const decryptedPassword = decrypt(this.password);
  return password === decryptedPassword;
};



module.exports = mongoose.model('Company', companySchema);
