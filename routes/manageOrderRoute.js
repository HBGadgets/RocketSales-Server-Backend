const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { ganaretInvoice, getInvoice } = require("../controllers/manageOrderController");


const router = express.Router();


router.post('/invoice',authenticate, ganaretInvoice); 
router.get('/invoice',authenticate, getInvoice); 

module.exports = router;