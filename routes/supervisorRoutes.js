const express = require('express');
const supervisorController = require('../controllers/supervisorController');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');


// Supervisor CRUD
router.post('/supervisor',authenticate, supervisorController.addSupervisor);

router.get('/Company/:companyId/branch/:branchId/supervisors', supervisorController.getSupervisors);
router.put('/Company/:companyId/branch/:branchId/supervisor/:supervisorId', supervisorController.updateSupervisor);
router.delete('/Company/:companyId/branch/:branchId/supervisor/:supervisorId', supervisorController.deleteSupervisor);

module.exports = router;
