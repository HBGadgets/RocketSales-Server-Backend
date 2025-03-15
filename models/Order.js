const mongoose = require('mongoose');
const { db1 }= require('../config/db'); 

const orderSchema = new mongoose.Schema({

  products: [
    {
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      hsnCode: { type: String,},
    }
  ],
  shopName: { type: String,},
  shopAddress: { type: String,},
  shopContact: { type: String,},
  deliveryDate: { type: String,},
  shopOwnerName: { type: String,},
  status: { type: String, default: 'Pending',enum: ['Pending', 'Completed'] },
  phoneNo: { type: String,},
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' },
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref:'Salesman' },
  
    },{
     timestamps: true
    });

   module.exports = db1.model('Order', orderSchema);
   