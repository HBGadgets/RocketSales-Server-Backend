const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { ganaretInvoice, getInvoice, updateInvoice, deleteInvoice } = require("../controllers/manageOrderController");


const router = express.Router();


router.post('/invoice',authenticate, ganaretInvoice); 
router.get('/invoice',authenticate, getInvoice); 
router.put('/invoice/:id',authenticate, updateInvoice); 
router.delete('/invoice/:id',authenticate, deleteInvoice); 

module.exports = router;