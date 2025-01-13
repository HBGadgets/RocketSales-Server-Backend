const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskGroupId: { type: String, },
  taskDescription: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Completed'] },
  deadline: { type: Date, required: true },
  assignedTo: { type: String, required: true }, 
  assignedBy: { type: String, required: true }, 
  complitionDate:{type: String, },
  latitude:{type: Number, required: true },
  longitude:{type: Number, required: true },
  complitionDate:{type:Number}
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
