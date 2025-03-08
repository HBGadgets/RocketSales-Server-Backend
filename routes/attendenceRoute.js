const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const router = express.Router();
const multer = require("multer");
const { handleImageProcessing } = require('../utils/imageProcessor');

const { postAttendance, getAttendance,updateAttendance, getForManualAttendance, updateCheckOutTime } = require("../controllers/attendenceController");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



router.post('/attendence', upload.single("profileImgUrl"), authenticate,  postAttendance);


router.get('/attendence',authenticate, getAttendance);
router.put('/attendence/:id',authenticate, updateAttendance);
router.put('/updatecheckouttime/:id',authenticate, updateCheckOutTime);


router.get('/manualattendence',authenticate, getForManualAttendance);

module.exports = router;