const mongoose = require('mongoose');
const { db1 }= require('../config/db'); 

const attendenceSchema = new mongoose.Schema({

  profileImgUrl:{type: String,},
  attendenceStatus:  { type: String, enum: ['Absent', 'Present', 'Leave'] },
  latitude:{type: Number},// required: true 
  longitude:{type: Number},
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref:'Salesman' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' }, 
  checkOutTime: { type: Date },
  startLat: { type: Number },  
  startLong: { type: Number },  
  endLat: { type: Number },  
  endLong: { type: Number }, 
  createdAt: {
      type: Date,
      default: Date.now,
    }, 
    });

   module.exports = db1.model('Attendence', attendenceSchema);
   