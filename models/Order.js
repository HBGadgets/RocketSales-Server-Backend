const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  productName:{type: String,},
  quantity:  { type: String,},
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' },
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref:'Salesman' },
  
    },{
     timestamps: true
    });

   module.exports = mongoose.model('Order', orderSchema);
   