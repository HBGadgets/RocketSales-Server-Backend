const Attendence = require("../models/Attendence");
const LeaveRequest = require("../models/LeaveRequest");
const moment = require("moment");
const Salesman = require("../models/Salesman");
const fs = require('fs');
const path = require('path');
const { handleImageProcessing } = require("../utils/imageProcessor");

exports.postAttendance = async (req, res) => {
     try {
       const {
               
               salesmanId, 
               attendenceStatus,
               startLat,
               startLong,
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

        // let base64Image = null;
        // if (profileImgBase64) {
        //        base64Image = req.file.buffer.toString("base64");
        // }

        let base64Image = null;

        if (req.file) {
          // Resize image before converting to Base64
          const resizedImageBuffer = await handleImageProcessing(req.file);
          base64Image = `${resizedImageBuffer.toString("base64")}`;
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
               startLat,
               startLong,
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


// exports.getAttendance = async (req, res) => {
//      try {
//        let todayAttendance;
   
//        const { role, id } = req.user;
//        const { startDate, endDate } = req.query;
   
//        const startOfDay = startDate ? new Date(startDate) : new Date();
//        const endOfDay = endDate ? new Date(endDate) : new Date();
   
//        if (!startDate) startOfDay.setHours(0, 0, 0, 0);
//        if (!endDate) endOfDay.setHours(23, 59, 59, 999);
   
//        if (role == 'superadmin') {
//          todayAttendance = await Attendence.find({
//            createdAt: {
//              $gte: startOfDay,
//              $lte: endOfDay,
//            },
//          }).populate("companyId","companyName")
//          .populate("branchId","branchName")
//          .populate("supervisorId","supervisorName")
//          .populate("salesmanId","salesmanName");

//        } else if (role == 'company') {
//          todayAttendance = await Task.find({
//            companyId: id,
//            createdAt: {
//              $gte: startOfDay,
//              $lte: endOfDay,
//            },
//          }).populate("companyId","companyName")
//                               .populate("branchId","branchName")
//                               .populate("supervisorId","supervisorName")
//                               .populate("salesmanId","salesmanName");
//        } else if (role == 'branch') {
//          todayAttendance = await Attendence.find({
//            branchId: id,
//            createdAt: {
//              $gte: startOfDay,
//              $lte: endOfDay,
//            },
//          }).populate("companyId","companyName")
//          .populate("branchId","branchName")
//          .populate("supervisorId","supervisorName")
//          .populate("salesmanId","salesmanName");
//        } else if (role == 'supervisor') {
//          todayAttendance = await Attendence.find({
//            supervisorId: id,
//            createdAt: {
//              $gte: startOfDay,
//              $lte: endOfDay,
//            },
//          });
//        } else if (role == 'salesman') {
//          todayAttendance = await Attendence.find({
//            salesmanId: id,
//            createdAt: {
//              $gte: startOfDay,
//              $lte: endOfDay,
//            },
//          }).populate("companyId","companyName")
//          .populate("branchId","branchName")
//          .populate("supervisorId","supervisorName")
//          .populate("salesmanId","salesmanName");
//        }
   
//        res.status(200).json({
//          success: true,
//          data: todayAttendance,
//        });
//      } catch (error) {
//        res.status(500).json({
//          success: false,
//          message: error.message,
//        });
//      }
//    };

console.log("")
exports.getAttendance = async (req, res) => {
  try {
    let todayAttendance;
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
      todayAttendance = await Attendence.find(query)
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        .populate("supervisorId", "supervisorName")
        .populate("salesmanId", "salesmanName");
    } else if (role === "company") {
      todayAttendance = await Attendence.find({ ...query, companyId: id })
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        .populate("supervisorId", "supervisorName")
        .populate("salesmanId", "salesmanName");
    } else if (role === "branch") {
      todayAttendance = await Attendence.find({ ...query, branchId: id })
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        .populate("supervisorId", "supervisorName")
        .populate("salesmanId", "salesmanName");
    } else if (role === "supervisor") {
      todayAttendance = await Attendence.find({ ...query, supervisorId: id })  
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        // .populate("supervisorId", "supervisorName")
        .populate("salesmanId", "salesmanName");
    } else if (role === "salesman") {
      todayAttendance = await Attendence.find({ ...query, salesmanId: id })
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        .populate("supervisorId", "supervisorName")
        // .populate("salesmanId", "salesmanName");
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

// exports.getAttendance = async (req, res) => {
//   try {
//     let todayAttendance;
//     const { role, id } = req.user;
//     const { startDate, endDate, filter } = req.query;

//     let startOfDay, endOfDay;

//     switch (filter) {
//       case "today":
//         startOfDay = moment().startOf("day").toDate();
//         endOfDay = moment().endOf("day").toDate();
//         break;
//       case "yesterday":
//         startOfDay = moment().subtract(1, "days").startOf("day").toDate();
//         endOfDay = moment().subtract(1, "days").endOf("day").toDate();
//         break;
//       case "thisWeek":
//         startOfDay = moment().startOf("week").toDate();
//         endOfDay = moment().endOf("week").toDate();
//         break;
//       case "lastWeek":
//         startOfDay = moment().subtract(1, "weeks").startOf("week").toDate();
//         endOfDay = moment().subtract(1, "weeks").endOf("week").toDate();
//         break;
//       case "thisMonth":
//         startOfDay = moment().startOf("month").toDate();
//         endOfDay = moment().endOf("month").toDate();
//         break;
//       case "preMonth":
//         startOfDay = moment().subtract(1, "months").startOf("month").toDate();
//         endOfDay = moment().subtract(1, "months").endOf("month").toDate();
//         break;
//       default:
//         startOfDay = startDate ? new Date(startDate) : moment().startOf("day").toDate();
//         endOfDay = endDate ? new Date(endDate) : moment().endOf("day").toDate();
//     }

//     let query = { createdAt: { $gte: startOfDay, $lte: endOfDay } };

//     if (role === "superadmin") {
//       todayAttendance = await Attendence.find(query)
//         .populate("companyId", "companyName")
//         .populate("branchId", "branchName")
//         .populate("supervisorId", "supervisorName")
//         .populate("salesmanId", "salesmanName");
//     } else if (role === "company") {
//       todayAttendance = await Attendence.find({ ...query, companyId: id })
//         .populate("companyId", "companyName")
//         .populate("branchId", "branchName")
//         .populate("supervisorId", "supervisorName")
//         .populate("salesmanId", "salesmanName");
//     } else if (role === "branch") {
//       todayAttendance = await Attendence.find({ ...query, branchId: id })
//         .populate("companyId", "companyName")
//         .populate("branchId", "branchName")
//         .populate("supervisorId", "supervisorName")
//         .populate("salesmanId", "salesmanName");
//     } else if (role === "supervisor") {
//       todayAttendance = await Attendence.find({ ...query, supervisorId: id });
//     } else if (role === "salesman") {
//       todayAttendance = await Attendence.find({ ...query, salesmanId: id })
//         .populate("companyId", "companyName")
//         .populate("branchId", "branchName")
//         .populate("supervisorId", "supervisorName")
//         .populate("salesmanId", "salesmanName");
//     }

//     todayAttendance = await Promise.all(todayAttendance.map(async (record) => {
//       if (record.profileImgUrl) {
//         try {
//           const imagePath = path.join(__dirname, '..', record.profileImgUrl);
//           if (fs.existsSync(imagePath)) {
//             const imageBuffer = fs.readFileSync(imagePath);
//             record.profileImgBase64 = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
//           } else {
//             record.profileImgBase64 = null;
//           }
//         } catch (error) {
//           console.error("Error converting image:", error);
//           record.profileImgBase64 = null;
//         }
//       }
//       return record;
//     }));




//     res.status(200).json({
//       success: true,
//       data: todayAttendance,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


exports.updateAttendance = async (req, res) => {

     try {
       const { attendenceStatus } = req.body;
       const {id} = req.params;

       if (!attendenceStatus) {
         return res.status(400).json({
           success: false,
           message: "Attendance Status is required.",
         });
       }
   
       const attendance = await Attendence.findOneAndUpdate(
        { _id: id,},
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

  
exports.getForManualAttendance = async (req, res) => {
  try {
    const { role, id } = req.user;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let allSalesmen;

    if (role === "superadmin") {
      allSalesmen = await Salesman.find().select("-profileImage")
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        .populate("supervisorId", "supervisorName");
    } else if (role === "company") {
      allSalesmen = await Salesman.find({ companyId: id }).select("-profileImage")
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        .populate("supervisorId", "supervisorName");
    } else if (role === "branch") {
      allSalesmen = await Salesman.find({ branchId: id }).select("-profileImage")
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        .populate("supervisorId", "supervisorName");
    } else if (role === "supervisor") {
      allSalesmen = await Salesman.find({ supervisorId: id }).select("-profileImage")
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        .populate("supervisorId", "supervisorName");
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized role",
      });
    }

    const todayAttendance = await Attendence.find({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const presentSalesmanIds = todayAttendance?.map((att) => att.salesmanId.toString());

    let absentSalesmen;
    if (presentSalesmanIds && presentSalesmanIds.length > 0) {
      absentSalesmen = allSalesmen.filter(
        (salesman) => !presentSalesmanIds?.includes(salesman._id.toString())
      );
    } else {
      absentSalesmen = allSalesmen;
    }

    if (absentSalesmen.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Salesmen who did not attend today",
        absentSalesmen,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "All salesmen attended today",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching attendance",
      error: error.message,
    });
  }
};
 

//   checkOutTime & endlatlong updation controller

exports.updateCheckOutTime = async (req, res) => {
  try {
    const { checkOutTime,endLat,endLong } = req.body;
    const { id } = req.params;

    if (!checkOutTime) {
      return res.status(400).json({
        success: false,
        message: "Check-out time is required.",
      });
    }

    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();
    
    const attendance = await Attendence.findOneAndUpdate(
      {
        salesmanId: id,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      },
      { $set: { checkOutTime,endLat,endLong } },
      { new: true, upsert: false }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No attendance record found for today to update checkout time.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Check-out time updated successfully.",
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
