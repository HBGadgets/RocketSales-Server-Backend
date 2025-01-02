const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');

// Branch CRUD
router.post('/Company/:companyId/branch', branchController.addBranch);
router.get('/Company/:companyId/branches', branchController.getBranches);
router.put('/Company/:companyId/branch/:branchId', branchController.updateBranch);
router.delete('/Company/:companyId/branch/:branchId', branchController.deleteBranch);

module.exports = router;


module.exports = router;
