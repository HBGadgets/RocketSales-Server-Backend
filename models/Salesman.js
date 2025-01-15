const mongoose = require('mongoose');

const salesmanSchema = new mongoose.Schema({
  salesmanName: { type: String, required: true },
  salesmanEmail: { type: String,sparse: true, },
  salesmanPhone: { type: String, required: true },
  Username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Number, default: 0 }, 
  companyId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  supervisorId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' },
  
},{
  timestamps: true
});

module.exports = mongoose.model('Salesman', salesmanSchema);