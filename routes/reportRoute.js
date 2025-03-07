const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { getDistance, getDistanceDayWise, getTaskReport } = require("../controllers/reportController");
const router = express.Router();


router.get('/distance', getDistance);
router.get('/distancedaywise', getDistanceDayWise);
router.get('/taskreport', getTaskReport);




module.exports = router;