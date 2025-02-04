const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { postExpence, getExpence, putExpence, deleteExpence, getExpenceType, putExpenceType, deleteExpenceType, postExpenceType } = require('../controllers/expenceController');
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

                    //  expence Routes
router.post("/expence", upload.single("billdoc"),authenticate,postExpence)
router.get("/expence",authenticate,getExpence)
router.put("/expence/:id",authenticate,putExpence)
router.delete("/expence/:id",authenticate,deleteExpence)


                    // expence Type Routes 
router.post("/expencetype",authenticate,postExpenceType)
router.get("/expencetype",authenticate,getExpenceType)
router.put("/expencetype/:id",authenticate,putExpenceType)
router.delete("/expencetype/:id",authenticate,deleteExpenceType)

module.exports = router;