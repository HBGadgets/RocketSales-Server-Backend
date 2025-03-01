const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { getDistance, getDistanceDayWise } = require("../controllers/reportController");
const router = express.Router();


router.get('/distance', getDistance);
router.get('/distancedaywise', getDistanceDayWise);




module.exports = router;