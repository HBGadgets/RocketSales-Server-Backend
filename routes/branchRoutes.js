const express = require('express');
const router = express.Router();
const { addBranch, updateBranch, deleteBranch, getBranches } = require('../controllers/branchController');
const authenticate = require('../middlewares/authMiddleware');

                    // Branch CRUD
router.post('/createbranch',authenticate, addBranch);
router.get('/getbranches',authenticate,getBranches);
router.put('/updatebranch/:id',authenticate,updateBranch);


router.delete('/deletebranch/:id',authenticate, deleteBranch);

module.exports = router;


module.exports = router;
