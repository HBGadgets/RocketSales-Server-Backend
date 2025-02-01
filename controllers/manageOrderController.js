const Invoice = require("../models/Invoice");


exports.ganaretInvoice = async (req, res) => {

          const {
          customerName,
          customerAddress,
          companyName,
          companyAddress,
          quantity,
          date,
          gst,
          HSNcode,
          discount,
          Unitprice,
          totalAmount, 
          companyId,
          branchId,
          supervisorId    } = req.body;

      try {  

       if (!customerName || !companyName || !companyAddress || !quantity || !date ) {
         return res.status(400).json({ message: "customerName,companyName,quantity,date fields are required" });
       }

      const newinvoice = await Invoice.create({
          customerName,
          customerAddress,
          companyName,
          companyAddress,
          quantity,
          date,
          gst,
          HSNcode,
          discount,
          Unitprice,
          totalAmount,
          companyId,
          branchId,
          supervisorId 
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

    if (role === "superadmin") {
      invoices = await Invoice.find()
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
      invoices = await Invoice.find({ branchId: id })
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        .populate("supervisorId", "supervisorName")
        // .populate("salesmanId", "salesmanName");
    } else if (role === "supervisor") {
      invoices = await Invoice.find({ supervisorId: id });
     }
      // else if (role === "salesman") {
    //   todayAttendance = await Invoice.find({ salesmanId: id })
    //     .populate("companyId", "companyName")
    //     .populate("branchId", "branchName")
    //     .populate("supervisorId", "supervisorName")
    //     .populate("salesmanId", "salesmanName");
    // }

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
    quantity,
    date,
    gst,
    HSNcode,
    discount,
    Unitprice,
    totalAmount,
    companyId,
    branchId,     
    supervisorId,} = req.body; 
    
    try {
      
      const updatedInvoice = await Invoice.findOneAndUpdate({_id:id}, {customerName,
        customerAddress,
        companyName,
        companyAddress,
        quantity,
        date,
        gst,
        HSNcode,
        discount,
        Unitprice,
        totalAmount,
        companyId,
        branchId,     
        supervisorId, }, 
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
