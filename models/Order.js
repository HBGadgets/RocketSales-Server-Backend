const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  products: [
    {
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  shopName: { type: String,},
  shopAddress: { type: String,},
  shopContact: { type: String,},
  deliveryDate: { type: String,},
  shopOwnerName: { type: String,},
  phoneNo: { type: String,},
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' },
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref:'Salesman' },
  
    },{
     timestamps: true
    });

   module.exports = mongoose.model('Order', orderSchema);
   