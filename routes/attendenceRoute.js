const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { postAttendance, getAttendance,updateAttendance } = require("../controllers/attendenceController");

const router = express.Router();

router.post('/attendence',authenticate, postAttendance);
router.get('/attendence',authenticate, getAttendance);
router.put('/attendence/:id',authenticate, updateAttendance);



module.exports = router;