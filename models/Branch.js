const mongoose = require('mongoose');




const branchSchema = new mongoose.Schema({
     branchName: { type: String, required: true },
     branchLocation: { type: String, required: true },
     branchEmail: { type: String, sparse: true,},
     branchPhone: { type: String, required: false }, 
     supervisorsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' }], 
     username: { type: String, required: true, unique: true,sparse: true, },
     password: { type: String, required: true },
     role: { type: Number, default: 0 }, 
     companyId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    },
   {
     timestamps: true
   });

   module.exports = mongoose.model('Branch', branchSchema);
