const Expence = require("../models/Expence");
const ExpenceType = require("../models/ExpenceType");
const moment = require("moment");



exports.postExpence = async (req,res) => {

     try {
          const { 
               expenceType,
               expenceDescription,
               date,
               amount,
               salesmanId,
               companyId,
               branchId,
               supervisorId } =req.body;

          let base64Image = null;
          if (req.file) {
                 base64Image = req.file.buffer.toString("base64");
          }

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
          billDoc:base64Image,
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

          if (role == 'superadmin') {
               expences = await Expence.find({...query})
                  .populate("companyId","companyName")
                  .populate("branchId","branchName")
                  .populate("supervisorId","supervisorName")
                  .populate("salesmanId","salesmanName");
         
                } else if (role == 'company') {
                    expences = await Expence.find({...query,
                    companyId: id,
                  }).populate("companyId","companyName")
                                       .populate("branchId","branchName")
                                       .populate("supervisorId","supervisorName")
                                       .populate("salesmanId","salesmanName");
                } else if (role == 'branch') {
                    expences = await Expence.find({
                         ...query,
                    branchId: id,
                  }).populate("companyId","companyName")
                  .populate("branchId","branchName")
                  .populate("supervisorId","supervisorName")
                  .populate("salesmanId","salesmanName");
                } else if (role == 'supervisor') {
                    expences = await Expence.find({
                    ...query,
                    supervisorId: id,
                  });
                } else if (role == 'salesman') {
                    expences = await Expence.find({
                    ...query,
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




              //  Expence Types Apis
              
exports.postExpenceType = async (req,res) => {
     
     try {
               const {expenceType,branchId,companyId} = req.body;

               if(!expenceType ||!branchId||!companyId){

                   return res.status (400).json({
                    success: false,
                    message: 'expenceType, branchId and companyId is requird',
                    });
                    }

               const newExpenceType = await ExpenceType({expenceType,branchId,companyId});
                    
               const saveExpenceType = await newExpenceType.save();

               res.status(201).json({
                    success: true,
                    message: 'Expence Type recorded successfully.',
                    data: saveExpenceType,
                    });
               
                    
               } catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message,
                    });              
               }

}

exports.getExpenceType = async (req,res) => {     

     const { role,id, companyId } = req.user;
     let expenceTypes;

     try {

          if (role == 'superadmin') {
               expenceTypes = await ExpenceType.find()
               .populate("companyId","companyName")
               .populate("branchId","branchName");
          } else if (role == 'company') {
               expenceTypes = await ExpenceType.find({
                    companyId: id,
               }).populate("companyId","companyName")
               .populate("branchId","branchName");
          } else if (role == 'branch') {
               expenceTypes = await ExpenceType.find({
                    companyId: companyId,
               }).populate("companyId","companyName")
               .populate("branchId","branchName");
          } else if (role == 'supervisor') {
               expenceTypes = await ExpenceType.find({
                    companyId: companyId,
               }).populate("companyId","companyName")
               .populate("branchId","branchName");
          } else if (role == 'salesman') {
               expenceTypes = await ExpenceType.find({
                    companyId: companyId,
               }).populate("companyId","companyName")
               .populate("branchId","branchName");
          }
          
          res.status(200).json({
               success: true,
               message: 'Expence Type fetched successfully.',
               data: expenceTypes,
             });
          
          } catch (error) {
               res.status(500).json({
                    success: false,
                    message: error.message,
                  });
          }
          
}

exports.putExpenceType = async (req,res) => {

     try {
          const { id } = req.params;
          const { expenceType, branchId, companyId } = req.body;
          
          const updatedExpenceType = await ExpenceType.findByIdAndUpdate(id,{expenceType, branchId, companyId} ,
               { new: true, runValidators: true });
               
          if (!updatedExpenceType) {
               return res.status(404).json({
                    success: false,
                    message: 'Expence Type not found',
                  });
          }

          return res.status(404).json({
               success: true,
               message: 'Expence Type Updated successfully',
               data:updatedExpenceType
             });

     } catch (error) {   
          res.status(500).json({
               success: false,
               message: error.message,
             });
     }
}

exports.deleteExpenceType = async (req,res) => {  
     
     try {
          const { id } = req.params;
          const deletedExpenceType = await ExpenceType.findByIdAndDelete(id);

          if (!deletedExpenceType) {
               return res.status(404).json({
                    success: false,
                    message: 'Expence Type not found',
                  });
          }
          res.status(200).json({
               success: true,
               message: 'Expence Type deleted successfully',
             });
          
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message,
             });
     }
}