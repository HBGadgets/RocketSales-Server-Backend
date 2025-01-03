const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskGroupId: { type: String, required: true }, // Unique identifier for grouped tasks
  taskDescription: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Completed'] },
  deadline: { type: Date, required: true },
  assignedTo: { type: String, required: true }, // Salesman username
  assignedBy: { type: String, required: true }, // Supervisor username
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
