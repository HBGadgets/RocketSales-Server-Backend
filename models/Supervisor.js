const mongoose = require('mongoose');
const { decrypt, encrypt } = require('../utils/cryptoUtils');
const { db1 }= require('../config/db'); 

const supervisorSchema = new mongoose.Schema({
  supervisorName: { type: String, },
  supervisorEmail: { type: String,}, 
  supervisorPhone: { type: String,  }, 
  salesmansIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Salesman' }], 
  username: { type: String, required: true, unique: true, },
  password: { type: String, required: true },
  role: { type: Number, default: 0 }, 
  companyId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
},{
  timestamps: true
});


supervisorSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = encrypt(this.password);
  }
  next();
});

supervisorSchema.methods.comparePassword = async function(password) {

  const decryptedPassword = decrypt(this.password);
  return password === decryptedPassword;
};



module.exports = db1.model('Supervisor',supervisorSchema );
