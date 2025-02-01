const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { postExpence, getExpence, putExpence, deleteExpence } = require('../controllers/expenceController');
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/expence", upload.single("billdoc"),authenticate,postExpence)
router.get("/expence",authenticate,getExpence)
router.put("/expence/:id",authenticate,putExpence)
router.delete("/expence/:id",authenticate,deleteExpence)



module.exports = router;