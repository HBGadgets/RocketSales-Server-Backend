const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { addSalesman, getSalesmen, updateSalesman, deleteSalesman } = require('../controllers/salesmanController');

// ---------------CRUD Api of architecture--------------------
router.post('/salesman',authenticate, addSalesman);
router.get('/salesman',authenticate,getSalesmen);
router.put('/salesman/:id',authenticate, updateSalesman);
router.delete('/salesman/:id', deleteSalesman);

module.exports = router;
