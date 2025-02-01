const Attendence = require("../models/Attendence");
const LeaveRequest = require("../models/LeaveRequest");


exports.postAttendance = async (req, res) => {
     try {
       const {
               
               salesmanId, 
               attendenceStatus,
               latitude,
               longitude,
               companyId,
               branchId,
               supervisorId } = req.body;

       const startOfDay = new Date();
       startOfDay.setHours(0, 0, 0, 0);
   
       const endOfDay = new Date();
       endOfDay.setHours(23, 59, 59, 999);
   
      
       if (!salesmanId || !attendenceStatus) {
         return res.status(400).json({
           success: false,
           message: 'Both `salesmanId` and `attendenceStatus` are required.',
         });
       }
   
       const existingAttendance = await Attendence.findOne({
          salesmanId,
          attendenceStatus: { $in: ['Present', 'Absent'] }, 
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        });

        let base64Image = null;
        if (req.file) {
               base64Image = req.file.buffer.toString("base64");
        }

    
        if (existingAttendance) {
          return res.status(400).json({
            success: false,
            message: 'Attendance has already been marked for today.',
          });
        }
   
       const newAttendance = new Attendence({
               profileImgUrl:base64Image,
               salesmanId,
               attendenceStatus,
               latitude,
               longitude,
               companyId,
               branchId,
               supervisorId 
       });
   
       const savedAttendance = await newAttendance.save();
   
       res.status(201).json({
         success: true,
         message: 'Attendance recorded successfully.',
         data: savedAttendance,
       });
     } catch (error) {
       res.status(500).json({
         success: false,
         message: error.message,
       });
     }
   };


   
exports.getAttendance = async (req, res) => {
     try {
       let todayAttendance;
   
       const { role, id } = req.user;
       const { startDate, endDate } = req.query;
   
       const startOfDay = startDate ? new Date(startDate) : new Date();
       const endOfDay = endDate ? new Date(endDate) : new Date();
   
       if (!startDate) startOfDay.setHours(0, 0, 0, 0);
       if (!endDate) endOfDay.setHours(23, 59, 59, 999);
   
       if (role == 'superadmin') {
         todayAttendance = await Attendence.find({
           createdAt: {
             $gte: startOfDay,
             $lte: endOfDay,
           },
         }).populate("companyId","companyName")
         .populate("branchId","branchName")
         .populate("supervisorId","supervisorName")
         .populate("salesmanId","salesmanName");

       } else if (role == 'company') {
         todayAttendance = await Task.find({
           companyId: id,
           createdAt: {
             $gte: startOfDay,
             $lte: endOfDay,
           },
         }).populate("companyId","companyName")
                              .populate("branchId","branchName")
                              .populate("supervisorId","supervisorName")
                              .populate("salesmanId","salesmanName");
       } else if (role == 'branch') {
         todayAttendance = await Attendence.find({
           branchId: id,
           createdAt: {
             $gte: startOfDay,
             $lte: endOfDay,
           },
         }).populate("companyId","companyName")
         .populate("branchId","branchName")
         .populate("supervisorId","supervisorName")
         .populate("salesmanId","salesmanName");
       } else if (role == 'supervisor') {
         todayAttendance = await Attendence.find({
           supervisorId: id,
           createdAt: {
             $gte: startOfDay,
             $lte: endOfDay,
           },
         });
       } else if (role == 'salesman') {
         todayAttendance = await Attendence.find({
           salesmanId: id,
           createdAt: {
             $gte: startOfDay,
             $lte: endOfDay,
           },
         }).populate("companyId","companyName")
         .populate("branchId","branchName")
         .populate("supervisorId","supervisorName")
         .populate("salesmanId","salesmanName");
       }
   
       res.status(200).json({
         success: true,
         data: todayAttendance,
       });
     } catch (error) {
       res.status(500).json({
         success: false,
         message: error.message,
       });
     }
   };



exports.updateAttendance = async (req, res) => {

     try {
       const { attendenceStatus } = req.body;
       const { searchDate } = req.query;
       const {id} = req.params;


      //  const findDate = searchDate ? new Date(searchDate) : new Date();
      const startOfDay = new Date(searchDate);
      startOfDay.setHours(0, 0, 0, 0);
    
      const endOfDay = new Date(searchDate);
      endOfDay.setHours(23, 59, 59, 999);
   
       if (!attendenceStatus) {
         return res.status(400).json({
           success: false,
           message: "Attendance Status is required.",
         });
       }
   
       const attendance = await Attendence.findOneAndUpdate(
        { salesmanId: id,createdAt: {
        $gte: startOfDay, 
        $lte: endOfDay, 
      },
    },
        { $set: { attendenceStatus } },
        { new: true, upsert: false } 
      );
      
      if (!attendance) {
        return res.status(400).json({
          success: false,
          message: "Attendance not find to update.",
        });
      }   
      
       res.status(200).json({
         success: true,
         message: "Attendance updated successfully.",
         data: attendance,
       });
     } catch (error) {
       res.status(500).json({
         success: false,
         message: error.message,
       });
     }
   };

   

