const mongoose = require('mongoose');

const supervisorSchema = new mongoose.Schema({
  supervisorName: { type: String, required: true },
  supervisorEmail: { type: String, sparse: true,}, 
  supervisorPhone: { type: String, required: false }, 
  salesmansIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Salesman' }], 
  username: { type: String, required: true, unique: true, sparse: true, },
  password: { type: String, required: true },
  role: { type: Number, default: 0 }, 
  companyId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
},{
  timestamps: true
});

module.exports = mongoose.model('Supervisor',supervisorSchema );
