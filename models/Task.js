const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: { type: String, },
  taskDescription: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Completed'] },
  deadline: { type: Date, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman' }, 
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' }, 
  address: { type: String, },
  // latitude:{type: Number, required: true },
  // longitude:{type: Number, required: true },
  complitionDate:{type: String, },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
