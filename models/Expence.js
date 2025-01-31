const mongoose = require('mongoose');

const expenceSchema = new mongoose.Schema({

  expenceType:{type: String,},
  expenceDescription:  { type: String, },
  date:{type: String},// required: true 
  billDoc:{type: String},
  amount:{type:String},
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref:'Salesman' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' }, 
  createdAt: {
      type: Date,
      default: Date.now,
    }, 
    });

   module.exports = mongoose.model('Expence', expenceSchema);
   