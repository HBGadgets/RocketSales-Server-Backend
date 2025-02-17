const Invoice = require("../models/Invoice");
const Order = require("../models/Order");
const moment = require("moment");
const ProductCollection = require("../models/ProductCollection");

                // Invoice API controller

exports.ganaretInvoice = async (req, res) => {

          const {
          customerName,
          customerAddress,
          companyName,
          companyAddress,
          products,
          date,
          gst,
          HSNcode,
          discount,
          Unitprice,
          totalAmount, 
          companyId,
          branchId,
          supervisorId,
          salesmanId    } = req.body;

      try {  

       if (!customerName || !companyName || !companyAddress ) {
         return res.status(400).json({ message: "customerName,companyName,quantity,date,productName fields are required" });
       }

      const newinvoice = await Invoice.create({
          customerName,
          customerAddress,
          companyName,
          companyAddress,
          products,
          date,
          gst,
          HSNcode,
          discount,
          Unitprice,
          totalAmount,
          companyId,
          branchId,
          supervisorId,
          salesmanId
      });
    const savedInvoice = await newinvoice.save();
      res.status(201).json({
        success: true,
        message: 'Invoice recorded successfully.',
        data: savedInvoice,
      });
    }
     catch (err) {
      res.status(500).json({ message: err.message });
     }
}

exports.getInvoice = async (req, res) => {

  const { id,role } = req.user;

  try {

    let invoices; 

        const { startDate, endDate, filter } = req.query;
    
        let startOfDay, endOfDay;
    
        switch (filter) {
          case "today":
            startOfDay = moment().startOf("day").toDate();
            endOfDay = moment().endOf("day").toDate();
            break;
          case "yesterday":
            startOfDay = moment().subtract(1, "days").startOf("day").toDate();
            endOfDay = moment().subtract(1, "days").endOf("day").toDate();
            break;
          case "thisWeek":
            startOfDay = moment().startOf("week").toDate();
            endOfDay = moment().endOf("week").toDate();
            break;
          case "lastWeek":
            startOfDay = moment().subtract(1, "weeks").startOf("week").toDate();
            endOfDay = moment().subtract(1, "weeks").endOf("week").toDate();
            break;
          case "thisMonth":
            startOfDay = moment().startOf("month").toDate();
            endOfDay = moment().endOf("month").toDate();
            break;
          case "preMonth":
            startOfDay = moment().subtract(1, "months").startOf("month").toDate();
            endOfDay = moment().subtract(1, "months").endOf("month").toDate();
            break;
          default:
            startOfDay = startDate ? new Date(startDate) : moment().startOf("day").toDate();
            endOfDay = endDate ? new Date(endDate) : moment().endOf("day").toDate();
        }
    
        let query = { createdAt: { $gte: startOfDay, $lte: endOfDay } };


    if (role === "superadmin") {
      invoices = await Invoice.find(query)
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        .populate("supervisorId", "supervisorName")
        // .populate("salesmanId", "salesmanName");
    } else if (role === "company") {
      invoices = await Invoice.find({ companyId: id })
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        .populate("supervisorId", "supervisorName")
        // .populate("salesmanId", "salesmanName");
    } else if (role === "branch") {
      invoices = await Invoice.find({...query, branchId: id })
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        .populate("supervisorId", "supervisorName")
        // .populate("salesmanId", "salesmanName");
    } else if (role === "supervisor") {
      invoices = await Invoice.find({...query, supervisorId: id });
     }
      else if (role === "salesman") {
      todayAttendance = await Invoice.find({...query, salesmanId: id })
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        .populate("supervisorId", "supervisorName")
        .populate("salesmanId", "salesmanName");
    }

    res.status(200).json({
       success: true, 
       data: invoices,
       message: 'invoices get successfully',
 
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

exports.updateInvoice = async (req, res) => {
  const  {id}  = req.params;
  const {
    customerName,
    customerAddress,
    companyName,
    companyAddress,
    productName,
    quantity,
    date,
    gst,
    HSNcode,
    discount,
    Unitprice,
    totalAmount,
    companyId,
    branchId,     
    supervisorId,
    salesmanId} = req.body; 
    
    try {
      
      const updatedInvoice = await Invoice.findOneAndUpdate({_id:id}, {customerName,
        customerAddress,
        companyName,
        companyAddress,
        productName,
        quantity,
        date,
        gst,
        HSNcode,
        discount,
        Unitprice,
        totalAmount,
        companyId,
        branchId,     
        supervisorId,
        salesmanId }, 
      { new: true, upsert: false } 
      );

        if (!updatedInvoice) {
          return res.status(404).json({ message: 'Invoice not found for update' });
        }

      res.status(200).json({ 
        success: true,
        message: 'Invoice updated successfully',
        data: updatedInvoice,
      }); 
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  
  
  
  
  
  
  }

exports.deleteInvoice = async (req, res) => {

  try {
    const { id } = req.params;

    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json({ 
      success: true,
      message: 'Invoice deleted successfully',
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}





                //  Order API controller


exports.postOrder = async (req, res) => {

  try {

    const { products,shopName,shopOwnerName,phoneNo,deliveryDate,shopAddress,companyId,branchId,supervisorId,salesmanId  } = req.body;

    if (!products) {
      return res.status(404).json({ message: 'Products is required' });
    }

    const newOrder = new Order({products,shopName,shopOwnerName,phoneNo,deliveryDate,shopAddress,companyId,branchId,supervisorId,salesmanId});
    const savedOrder = await newOrder.save();

    res.status(201).json({ message: 'Order added successfully', data: savedOrder });

  } catch (err) { 
    res.status(500).json({ message: err.message });
  }
}


exports.getOrders = async (req, res) => {

  try {
    let orders;
    const { role, id } = req.user;
    const { startDate, endDate, filter } = req.query;

    let startOfDay, endOfDay;

    switch (filter) {
      case "today":
        startOfDay = moment().startOf("day").toDate();
        endOfDay = moment().endOf("day").toDate();
        break;
      case "yesterday":
        startOfDay = moment().subtract(1, "days").startOf("day").toDate();
        endOfDay = moment().subtract(1, "days").endOf("day").toDate();
        break;
      case "thisWeek":
        startOfDay = moment().startOf("week").toDate();
        endOfDay = moment().endOf("week").toDate();
        break;
      case "lastWeek":
        startOfDay = moment().subtract(1, "weeks").startOf("week").toDate();
        endOfDay = moment().subtract(1, "weeks").endOf("week").toDate();
        break;
      case "thisMonth":
        startOfDay = moment().startOf("month").toDate();
        endOfDay = moment().endOf("month").toDate();
        break;
      case "preMonth":
        startOfDay = moment().subtract(1, "months").startOf("month").toDate();
        endOfDay = moment().subtract(1, "months").endOf("month").toDate();
        break;
      default:
        startOfDay = startDate ? new Date(startDate) : moment().startOf("day").toDate();
        endOfDay = endDate ? new Date(endDate) : moment().endOf("day").toDate();
    }

    let query = { createdAt: { $gte: startOfDay, $lte: endOfDay } };

    if (role === "superadmin") {
      orders = await Order.find(query)
        .populate("companyId", "companyName")
        .populate("branchId", "branchName branchLocation")
        .populate("supervisorId", "supervisorName")
        .populate("salesmanId", "salesmanName");
    } else if (role === "company") {
      orders = await Order.find({ ...query, companyId: id })
        .populate("companyId", "companyName")
        .populate("branchId", "branchName branchLocation")
        .populate("supervisorId", "supervisorName")
        .populate("salesmanId", "salesmanName");
    } else if (role === "branch") {
      orders = await Order.find({ ...query, branchId: id })
        .populate("companyId", "companyName")
        .populate("branchId", "branchName branchLocation")
        .populate("supervisorId", "supervisorName")
        .populate("salesmanId", "salesmanName");
    } else if (role === "supervisor") {
      orders = await Order.find({ ...query, supervisorId: id })
        .populate("companyId", "companyName")
        .populate("branchId", "branchName branchLocation")
        .populate("supervisorId", "supervisorName")
        .populate("salesmanId", "salesmanName");
    } else if (role === "salesman") {
      orders = await Order.find({ ...query, salesmanId: id })
        .populate("companyId", "companyName")
        .populate("branchId", "branchName branchLocation")
        .populate("supervisorId", "supervisorName")
        .populate("salesmanId", "salesmanName");
    }
    console.log("kkkkkkkkkkkksssssssssss",orders)

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  
};
} 


// exports.updateOrder = async (req, res) => {
//   const { id } = req.params;
//   const { productName,quantity,shopName,shopOwnerName,phoneNo,deliveryDate,shopAddress,companyId,branchId,supervisorId,salesmanId } = req.body;

//   try {
//     const updatedOrder = await Order.findOneAndUpdate({ _id: id }, { productName,quantity,shopName,shopOwnerName,phoneNo,deliveryDate,shopAddress,companyId,branchId,supervisorId,salesmanId}, { new: true, upsert: false });

//     if (!updatedOrder) {
//       return res.status(404).json({ message: 'Order not found for update' });
//     }
//     res.status(200).json({ message: 'Order updated successfully', data: updatedOrder });

//   }catch (err) {  
//     res.status(500).json({ message: err.message });
//   }
// }

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { products, shopName, shopOwnerName, phoneNo, deliveryDate, shopAddress, companyId, branchId, supervisorId, salesmanId } = req.body;

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id },
      { 
        products, 
        shopName, 
        shopOwnerName, 
        phoneNo, 
        deliveryDate, 
        shopAddress, 
        companyId, 
        branchId, 
        supervisorId, 
        salesmanId
      },
      { new: true, upsert: false }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found for update' });
    }

    res.status(200).json({ message: 'Order updated successfully', data: updatedOrder });

  } catch (err) {  
    res.status(500).json({ message: err.message });
  }
};



exports.deleteOrder = async (req, res) => { 
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


                  //  Product API controller

// exports.postProduct = async (req, res) => {  
//   try {
//     const { productName, quantity,companyId,branchId,supervisorId} = req.body;

//     const duplicateProduct = await ProductCollection.findOne({ productName,companyId });

//     if (duplicateProduct) {  
//       return res.status(400).json({ message: 'Product already exists' });
//     }

//     if (!productName || !quantity ||!companyId) {
//       return res.status(404).json({ message: 'Product Name & Quantity is required' });
//     }

//     const newProduct = new ProductCollection({ productName, quantity,companyId,branchId,supervisorId });
//     const savedProduct = await newProduct.save();

//     res.status(201).json({ message: 'Product added successfully', data: savedProduct });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }


exports.postProduct = async (req, res) => {
  try {
    const products = req.body.products;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Invalid input, expected an array of products' });
    }

    const newProducts = [];
    const duplicateProducts = [];
    const seenProducts = new Set(); // To track duplicates in the incoming array

    for (const product of products) {
      const { productName, quantity, companyId, branchId, supervisorId,perPicePrice } = product;

      if (!productName || !quantity || !companyId) {
        duplicateProducts.push({ productName, companyId, reason: "Missing required fields" });
        continue; // Skip this product
      }

      const uniqueKey = `${productName}-${companyId}`;

      // Check for duplicates within the request array
      if (seenProducts.has(uniqueKey)) {
        duplicateProducts.push({ productName, companyId, reason: "Duplicate in request" });
        continue;
      }
      seenProducts.add(uniqueKey);

      // Check if the product exists in the database
      const duplicateProduct = await ProductCollection.findOne({ productName, companyId });

      if (duplicateProduct) {
        duplicateProducts.push({ productName, companyId, reason: "Already exists in database" });
      } else {
        newProducts.push({ productName, quantity, companyId, branchId, supervisorId,perPicePrice });
      }
    }

    let savedProducts = [];
    if (newProducts.length > 0) {
      savedProducts = await ProductCollection.insertMany(newProducts);
    }

    return res.status(201).json({
      message: "Products processed",
      addedProducts: savedProducts,
      duplicates: duplicateProducts.length > 0 ? duplicateProducts : "No duplicates found",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




exports.getProducts = async (req, res) => {

  const { id, role, companyId } = req.user;
  let products;
  try { 
    
    
    if(role=='superadmin'){
                      products = await ProductCollection.find()
                      .populate("companyId","companyName")
                      .populate("branchId","branchName")
                      .populate("supervisorId","supervisorName")
                      .populate("salesmanId","salesmanName");
  
                     }else if(role =='company'){
                      products = await ProductCollection.find({companyId:id})
                      .populate("branchId","branchName")
                      .populate("supervisorId","supervisorName")
                      .populate("salesmanId","salesmanName");
  
  
                     }else if(role =='branch'){
                      products = await ProductCollection.find({companyId:companyId})
                      .populate("supervisorId","supervisorName")
                      .populate("salesmanId","salesmanName");
                      ;
              
                     }else if(role =='supervisor'){
                      products = await ProductCollection.find({companyId:companyId})
                      .populate("companyId","companyName")
                      .populate("branchId","branchName")                    
                      .populate("salesmanId","salesmanName");
  
              
                     }else if(role =='salesman'){
                      products = await ProductCollection.find({companyId:companyId})
                      .populate("companyId","companyName")
                      .populate("branchId","branchName")
                      .populate("supervisorId","supervisorName")
                      .populate("salesmanId","salesmanName");
              
                     }

    res.status(200).json({ message: 'Products get successfully', data: products });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { productName, quantity,companyId,branchId } = req.body;

  try {
    const updatedProduct = await ProductCollection.findOneAndUpdate({ _id: id }, { productName, quantity,companyId,branchId }, { new: true, upsert: false });  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found for update' });
      }   

      res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });

    } catch (err) {   
      res.status(500).json({ message: err.message });
    }   
} 

exports.deleteProduct = async (req, res) => { 
  try {
    const { id } = req.params;

    const deletedProduct = await ProductCollection.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

