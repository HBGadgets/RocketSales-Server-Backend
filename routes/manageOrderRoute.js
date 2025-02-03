const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { ganaretInvoice, getInvoice, updateInvoice, deleteInvoice, postOrder,getOrders, updateOrder, deleteOrder, postProduct, } = require("../controllers/manageOrderController");


const router = express.Router();

          //  Invoice API routes
router.post('/invoice',authenticate, ganaretInvoice); 
router.get('/invoice',authenticate, getInvoice); 
router.put('/invoice/:id',authenticate, updateInvoice); 
router.delete('/invoice/:id',authenticate, deleteInvoice); 


          // Order API routes
router.post('/order',authenticate, postOrder); 
router.get('/order',authenticate, getOrders); 
router.put('/order/:id',authenticate, updateOrder); 
router.delete('/order/:id',authenticate, deleteOrder); 

          // Product API routes
router.post('/product',authenticate, postProduct); 
router.get('/product',authenticate, getInvoice); 
router.put('/product/:id',authenticate, updateInvoice); 
router.delete('/product/:id',authenticate, deleteInvoice); 


module.exports = router;