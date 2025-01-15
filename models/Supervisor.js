const mongoose = require('mongoose');




const supervisorSchema = new mongoose.Schema({
  supervisorName: { type: String, required: true },
  supervisorEmail: { type: String, sparse: true,}, 
  supervisorPhone: { type: String, required: false }, 
  supervisorUsername: { type: String, required: true, unique: true, sparse: true, },
  password: { type: String, required: true },
  salesmen: [], 
},{
  timestamps: true
});



module.exports = mongoose.model('Supervisor',supervisorSchema );
