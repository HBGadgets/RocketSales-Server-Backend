const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { PostLeaveRequest, putLeaveRequestStatus, getLeaveRequest } = require("../controllers/leaveRequestController");
const router = express.Router();





router.post('/leaverequest',authenticate, PostLeaveRequest);
router.get('/leaverequest',authenticate, getLeaveRequest);
router.put('/leaverequest/:id',authenticate, putLeaveRequestStatus);



module.exports = router;