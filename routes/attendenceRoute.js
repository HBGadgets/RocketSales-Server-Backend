const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const router = express.Router();
const multer = require("multer");
const { handleImageProcessing } = require('../utils/imageProcessor');

const { postAttendance, getAttendance,updateAttendance, getForManualAttendance } = require("../controllers/attendenceController");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



router.post('/attendence', upload.single("profileImgUrl"), authenticate, async (req, res) => {
  try {
      let profileImgBase64 = null;

      if (req.file) {
          profileImgBase64 = req.file.buffer.toString("base64");
      }

      await postAttendance(req, res, profileImgBase64);
  } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


router.get('/attendence',authenticate, getAttendance);
router.put('/attendence/:id',authenticate, updateAttendance);


router.get('/manualattendence',authenticate, getForManualAttendance);

module.exports = router;