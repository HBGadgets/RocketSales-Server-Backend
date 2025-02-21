const mongoose = require('mongoose');
const { db1 }= require('../config/db'); 

const LeaveRequestSchema = new mongoose.Schema({

  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref:'Salesman' },
  leaveRequestStatus:  { type: String, default:'Pending', enum: ['Pending', 'Approve', 'Reject'] },
  leaveStartdate:{type:String},
  leaveEnddate:{type:String},
  reason:{type:String},
//   halfDay:{type:String, enum: [ 'firstHalf', 'secondHalf'] },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' }, 
  
    },{
     timestamps: true
    });

   module.exports = db1.model('LeaveRequest', LeaveRequestSchema);
   