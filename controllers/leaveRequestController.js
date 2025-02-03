const LeaveRequest = require("../models/LeaveRequest");



exports.PostLeaveRequest = async (req, res) => {
     try {

       const { salesmanId, leaveStartdate, leaveEnddate, reason, halfDay,supervisorId,branchId,companyId } = req.body;
   
       // Validate required fields
       if (!salesmanId || !leaveStartdate || !leaveEnddate || !reason) {
         return res.status(400).json({
           success: false,
           message: 'All fields are required: salesmanId, leaveStartdate, leaveEnddate, and reason.',
         });
       }
   
       const start = new Date(leaveStartdate);
       const end = new Date(leaveEnddate);
   
       if (start > end) {
         return res.status(400).json({
           success: false,
           message: 'Invalid date range. leave Startdate cannot be after leave Enddate.',
         });
       }
   
       const leaveRequest = new LeaveRequest({
        salesmanId,
        leaveStartdate,
        leaveEnddate,
        reason,
     //    halfDay: halfDay || false, 
        supervisorId,
        branchId,
        companyId
       });
   

       await leaveRequest.save();
   
       res.status(201).json({
         success: true,
         message: 'Leave request submitted successfully.',
         data: leaveRequest,
       });
     } catch (error) {
       res.status(500).json({
         success: false,
         message: 'An error occurred while processing the leave request.',
         error: error.message,
       });
     }
   };

exports.getLeaveRequest = async (req,res) => {

     try {
          let pendingLeaveRequest;

          const { id } = req.user;
          const { role } = req.user;          
          const { status} = req.query;
 
           if(role=='superadmin'){
               pendingLeaveRequest = await LeaveRequest.find()
                              .populate("companyId","companyName")
                              .populate("branchId","branchName")
                              .populate("supervisorId","supervisorName")
                              .populate("salesmanId","salesmanName");
          
                             }else if(role =='company'){
               pendingLeaveRequest = await LeaveRequest.find({ companyId: id })
                              .populate("branchId","branchName")
                              .populate("supervisorId","supervisorName")
                              .populate("salesmanId","salesmanName");
          
          
                             }else if(role =='branch'){
               pendingLeaveRequest = await LeaveRequest.find({ branchId: id, })
                              .populate("supervisorId","supervisorName")
                              .populate("salesmanId","salesmanName");
                              ;
                      
                             }else if(role =='supervisor'){
               pendingLeaveRequest = await LeaveRequest.find({ supervisorId: id, })
                              .populate("companyId","companyName")
                              .populate("branchId","branchName")                    
                              .populate("salesmanId","salesmanName");
          
                      
                             }else if(role =='salesman'){
               pendingLeaveRequest = await LeaveRequest.find({ salesmanId: id})
                              .populate("companyId","companyName")
                              .populate("branchId","branchName")
                              .populate("supervisorId","supervisorName");
                      
     }
     res.status(200).json({ 
          success: true,
          message: 'All Pending requset get successfully',
          data: pendingLeaveRequest,
     })
          
     } catch (error) {
          res.status(500).json({
               success: false,
               message: 'An error occurred while processing the leave request.',
               error: error.message,
          }); 
     }
     
}


exports.putLeaveRequestStatus = async (req,res) =>{
     try {
          const {id} = req.params
          const { leaveRequestStatus } = req.body;

          if(!leaveRequestStatus){
               return res.status(400).json({
                    success: false,
                    message: 'Leave request status is required',
                  });     
          }
     const updateLeaveRequestStatus = await LeaveRequest.findByIdAndUpdate({_id:id,leaveRequestStatus}, 
                                                                           { $set: { leaveRequestStatus } },
                                                                           { new: true, upsert: false } );

          res.status(200).json({
         success: true,
         message: "Leave Request updated successfully.",
         data: updateLeaveRequestStatus,
       });
          
     } catch (error) {

          res.status(500).json({
          success: false,
          message: 'An error occurred while processing the leave request.',
          error: error.message,
     });     
}
}

// exports.getLeaveRequest = async (req,res) => {

//   try {
//        let pendingLeaveRequest;

//        const { id } = req.user;
//        const { role } = req.user;          
//        const { status} = req.query;

//         if(role=='superadmin'){
//             pendingLeaveRequest = await LeaveRequest.find({leaveRequestStatus:status || "Pending"})
//                            .populate("companyId","companyName")
//                            .populate("branchId","branchName")
//                            .populate("supervisorId","supervisorName")
//                            .populate("salesmanId","salesmanName");
       
//                           }else if(role =='company'){
//             pendingLeaveRequest = await LeaveRequest.find({ companyId: id,leaveRequestStatus:status || "Pending" })
//                            .populate("branchId","branchName")
//                            .populate("supervisorId","supervisorName")
//                            .populate("salesmanId","salesmanName");
       
       
//                           }else if(role =='branch'){
//             pendingLeaveRequest = await LeaveRequest.find({ branchId: id,leaveRequestStatus:status || "Pending" })
//                            .populate("supervisorId","supervisorName")
//                            .populate("salesmanId","salesmanName");
//                            ;
                   
//                           }else if(role =='supervisor'){
//             pendingLeaveRequest = await LeaveRequest.find({ supervisorId: id,leaveRequestStatus:status || "Pending" })
//                            .populate("companyId","companyName")
//                            .populate("branchId","branchName")                    
//                            .populate("salesmanId","salesmanName");
       
                   
//                           }else if(role =='salesman'){
//             pendingLeaveRequest = await LeaveRequest.find({ salesmanId: id})
//                            .populate("companyId","companyName")
//                            .populate("branchId","branchName")
//                            .populate("supervisorId","supervisorName");
                   
//   }
//   res.status(200).json({ 
//        success: true,
//        message: 'All Pending requset get successfully',
//        data: pendingLeaveRequest,
//   })
       
//   } catch (error) {
//        res.status(500).json({
//             success: false,
//             message: 'An error occurred while processing the leave request.',
//             error: error.message,
//        }); 
//   }
  
// }