const mongoose = require('mongoose');




const branchSchema = new mongoose.Schema({
     branchName: { type: String, required: true },
     branchLocation: { type: String, required: true },
     branchEmail: { type: String, sparse: true,},
     branchPhone: { type: String, required: false }, 
     branchUsername: { type: String, required: true, unique: true,sparse: true, },
     password: { type: String, required: true },
     supervisors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' }], 
     company:{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
   },
   {
     timestamps: true
   });

   module.exports = mongoose.model('Branch', branchSchema);
