const mongoose = require('mongoose');




const salesmanSchema = new mongoose.Schema({
  salesmanName: { type: String, required: true },
  salesmanEmail: { type: String,sparse: true, },
  salesmanPhone: { type: String, required: true },
  salesmanUsername: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  company:{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  branch:{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  supervisor:{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }
  
},{
  timestamps: true
});

module.exports = mongoose.model('SalesMan', salesmanSchema);