const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const router = express.Router();
const multer = require("multer");
const { handleImageProcessing } = require('../utils/imageProcessor');

const { postAttendance, getAttendance,updateAttendance, getForManualAttendance } = require("../controllers/attendenceController");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



router.post('/attendence', upload.single("profileImgUrl"), authenticate, async (req, res) => {
     // const { file } = req;

     if (!req.file) {
         return res.status(400).json({ error: "No file uploaded" });
     }     try {
       
       const filePath = await handleImageProcessing(req.file);
   
       postAttendance(req, res, filePath); 
     } catch (error) {
       res.status(500).send(error.message);
     }
   });


   router.get('/attendence',authenticate, getAttendance);
router.put('/attendence/:id',authenticate, updateAttendance);


router.get('/manualattendence',authenticate, getForManualAttendance);

module.exports = router;