const express = require('express');
const supervisorController = require('../controllers/supervisorController');
const router = express.Router();

// Supervisor CRUD
router.post('/Company/:companyId/branch/:branchId/supervisor', supervisorController.addSupervisor);
router.get('/Company/:companyId/branch/:branchId/supervisors', supervisorController.getSupervisors);
router.put('/Company/:companyId/branch/:branchId/supervisor/:supervisorId', supervisorController.updateSupervisor);
router.delete('/Company/:companyId/branch/:branchId/supervisor/:supervisorId', supervisorController.deleteSupervisor);

module.exports = router;
