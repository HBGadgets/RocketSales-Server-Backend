const mongoose = require('mongoose');

const expenceTypeSchema = new mongoose.Schema({

  expenceType:{type: String,},
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },

    },{
     timestamps: true
    });

   module.exports = mongoose.model('ExpenceType', expenceTypeSchema);
   