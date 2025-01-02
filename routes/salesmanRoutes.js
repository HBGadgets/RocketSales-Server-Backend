const express = require('express');
const salesmanController = require('../controllers/salesmanController');
const router = express.Router();

// Salesman CRUD
router.post('/Company/:companyId/branch/:branchId/supervisor/:supervisorId/salesman', salesmanController.addSalesman);
router.get('/Company/:companyId/branch/:branchId/supervisor/:supervisorId/salesman', salesmanController.getSalesmen);
router.put('/Company/:companyId/branch/:branchId/supervisor/:supervisorId/salesman/:salesmanId', salesmanController.updateSalesman);
router.delete('/Company/:companyId/branch/:branchId/supervisor/:supervisorId/salesman/:salesmanId', salesmanController.deleteSalesman);

module.exports = router;
