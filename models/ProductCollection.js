const mongoose = require('mongoose');
const { db1 }= require('../config/db'); 

const productSchema = new mongoose.Schema({

  productName:{type: String,},
  quantity:  { type: Number,},
  perPicePrice:  { type: Number,},
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' },
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref:'Salesman' },
  
    },{
     timestamps: true
    });

module.exports = db1.model('Product', productSchema);
   