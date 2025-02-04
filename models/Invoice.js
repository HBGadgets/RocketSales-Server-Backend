const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({

  customerName:{type: String,},
  customerAddress:  { type: String,},
  companyName:{type: String,},
  companyAddress:  { type: String,},
  date:{type: String},// required: true 
  productName:{type: String},
  quantity:{type: String},
  gst:{type: String},
  HSNcode:{type: String},
  discount:{type: String},
  Unitprice:{type: String}, 
  totalAmount:{type: String},
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' },
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref:'Salesman' },
  
    },{
     timestamps: true
    });

   module.exports = mongoose.model('Invoice', invoiceSchema);
   