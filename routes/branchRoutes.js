const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { addBranch, updateBranch, deleteBranch, getBranches } = require('../controllers/branchController');

// ---------------CRUD Api of architecture--------------------
router.post('/branch',authenticate, addBranch);
router.get('/branch',authenticate,getBranches);
router.put('/branch/:id',updateBranch);
router.delete('/branch/:id',authenticate, deleteBranch);

module.exports = router;

