const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { setOverSpeed } = require("../controllers/overspeedController");
const router = express.Router();


router.post('/setoverspeed', setOverSpeed);





module.exports = router;