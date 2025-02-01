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

// exports.updateInvoice = async (req, res) => {
//   const { id } = req.params;
//   const {
//     customerName,
//     customerAddress,
//     companyName,
//     companyAddress,
//     quantity,
//     date,
//     gst,
//     HSNcode,
//     discount,
//     Unitprice,
//     totalAmount,
//     companyId,
//     branchId,     
//     supervisorId,} = req.body; 
  
  
  
  
  
  
//   }

