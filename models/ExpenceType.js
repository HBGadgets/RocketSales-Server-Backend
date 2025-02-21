const mongoose = require('mongoose');
const { db1 }= require('../config/db'); 

const expenceTypeSchema = new mongoose.Schema({

  expenceType:{type: String,},
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },

    },{
     timestamps: true
    });

   module.exports = db1.model('ExpenceType', expenceTypeSchema);
   