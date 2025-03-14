const mongoose = require('mongoose');
const { db1 }= require('../config/db'); 

const invoiceSchema = new mongoose.Schema({

  customerName:{type: String,},
  customerAddress:  { type: String,},
  companyName:{type: String,},
  companyAddress:  { type: String,},
  date:{type: String},// required: true 
  products: [
    {
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      hsnCode: { type: String,},

    }
  ],
  gst:{type: String},
  HSNcode:{type: String},
  discount:{type: String},
  Unitprice:{type: String}, 
  totalAmount:{type: String},
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' },
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref:'Salesman' },
  
    },{
     timestamps: true
    });

   module.exports = db1.model('Invoice', invoiceSchema);
   