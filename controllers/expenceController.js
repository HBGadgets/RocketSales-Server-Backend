const Expence = require("../models/Expence");



exports.postExpence = async (req,res) => {


     try {
          const { 
               expenceType,
               expenceDescription,
               date,
               billDoc,
               amount,
               salesmanId,
               companyId,
               branchId,
               supervisorId } =req.body;

          if(!expenceType || !amount){
               return res.status(400).json({
                    success: false,
                    message: 'expenceType and amount is requird',
                  });
          }

     const newExpence = await Expence({ 
          expenceType,
          expenceDescription,
          date,
          billDoc,
          amount,
          salesmanId,
          companyId,
          branchId,
          supervisorId });

     const saveExpence = await newExpence.save();

     res.status(201).json({
          success: true,
          message: 'Expence recorded successfully.',
          data: saveExpence,
        });
          
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message,
             });   
       }
             
}


exports.getExpence = async (req,res)=>{

     try {
          let expences;
          const { role, id } = req.user;

          if (role == 'superadmin') {
               expences = await Expence.find()
                  .populate("companyId","companyName")
                  .populate("branchId","branchName")
                  .populate("supervisorId","supervisorName")
                  .populate("salesmanId","salesmanName");
         
                } else if (role == 'company') {
                    expences = await Expence.find({
                    companyId: id,
                  }).populate("companyId","companyName")
                                       .populate("branchId","branchName")
                                       .populate("supervisorId","supervisorName")
                                       .populate("salesmanId","salesmanName");
                } else if (role == 'branch') {
                    expences = await Expence.find({
                    branchId: id,
                  }).populate("companyId","companyName")
                  .populate("branchId","branchName")
                  .populate("supervisorId","supervisorName")
                  .populate("salesmanId","salesmanName");
                } else if (role == 'supervisor') {
                    expences = await Expence.find({
                    supervisorId: id,
                  });
                } else if (role == 'salesman') {
                    expences = await Expence.find({
                    salesmanId: id,
                  }).populate("companyId","companyName")
                  .populate("branchId","branchName")
                  .populate("supervisorId","supervisorName")
                  .populate("salesmanId","salesmanName");
                }
            
          res.status(200).json({
               success: true,
               message: 'Expence fetched successfully.',
               data: expences,
             });
          
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message,
             });
     }
}


exports.putExpence = async (req,res) => {

     try {
          const { id } = req.params;
          const { expenceType, expenceDescription, date, billDoc, amount } = req.body;
          
          const updatedExpence = await Expence.findByIdAndUpdate(id,{expenceType, expenceDescription, date, billDoc, amount} , 
               { new: true, runValidators: true });  
               
          if (!updatedExpence) {
               return res.status(404).json({
                    success: false,
                    message: 'Expence not found',
                  });
          }

          return res.status(404).json({
               success: true,
               message: 'Expence Updated successfully',
               data:updatedExpence
             });
          
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message,
             });
     }
}


exports.deleteExpence = async (req,res) => {
                         
     try {
          const { id } = req.params;
          const deletedExpence = await Expence.findByIdAndDelete(id);

          if (!deletedExpence) {
               return res.status(404).json({
                    success: false,
                    message: 'Expence not found',
                  });
          }
          res.status(200).json({
               success: true,
               message: 'Expence deleted successfully',
             });
          
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message,
             });
     }
}

