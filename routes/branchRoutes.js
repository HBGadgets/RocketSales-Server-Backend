const express = require('express');
const router = express.Router();
const { addBranch, updateBranch, deleteBranch, getBranches } = require('../controllers/branchController');
const authenticate = require('../middlewares/authMiddleware');

                    // Branch CRUD
router.post('/createbranch',authenticate, addBranch);
router.get('/getbranches',authenticate,getBranches);


router.put('/Company/:companyId/branch/:branchId',updateBranch);
router.delete('/Company/:companyId/branch/:branchId', deleteBranch);

module.exports = router;


module.exports = router;
