const express = require('express');
const salesmanController = require('../controllers/salesmanController');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');

// Salesman CRUD
router.post('/salesman',authenticate, salesmanController.addSalesman);
router.get('/salesman',authenticate,salesmanController.getSalesmen);
router.put('/Company/:companyId/branch/:branchId/supervisor/:supervisorId/salesman/:salesmanId', salesmanController.updateSalesman);
router.delete('/Company/:companyId/branch/:branchId/supervisor/:supervisorId/salesman/:salesmanId', salesmanController.deleteSalesman);

module.exports = router;
