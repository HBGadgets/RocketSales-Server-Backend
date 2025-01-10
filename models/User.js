const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, sparse: true, },
  password: { type: String, required: true },
  role: { type: Number, default: 0 }, // 0 = Regular User, 1 = Admin, etc.
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' }, 
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman' }, 


  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
