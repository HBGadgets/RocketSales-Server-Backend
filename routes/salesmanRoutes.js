const express = require('express');
const {addSalesman,getSalesmen,updateSalesman,deleteSalesman} = require('../controllers/salesmanController');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');

// Salesman CRUD
router.post('/salesman',authenticate, addSalesman);
router.get('/Company/:companyId/branch/:branchId/supervisor/:supervisorId/salesman',getSalesmen);
router.put('/Company/:companyId/branch/:branchId/supervisor/:supervisorId/salesman/:salesmanId', updateSalesman);
router.delete('/Company/:companyId/branch/:branchId/supervisor/:supervisorId/salesman/:salesmanId', deleteSalesman);

module.exports = router;
