const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const router = express.Router();
const multer = require("multer");

const { postAttendance, getAttendance,updateAttendance } = require("../controllers/attendenceController");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/attendence',upload.single("profileImgUrl"),authenticate, postAttendance);
router.get('/attendence',authenticate, getAttendance);
router.put('/attendence/:id',authenticate, updateAttendance);



module.exports = router;