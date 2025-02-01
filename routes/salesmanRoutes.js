const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const multer = require('multer');
const { addSalesman, getSalesmen, updateSalesman, deleteSalesman } = require('../controllers/salesmanController');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ---------------CRUD Api of architecture--------------------
router.post('/salesman',authenticate,upload.single("profileImage"), addSalesman);
router.get('/salesman',authenticate,getSalesmen);
router.put('/salesman/:id',authenticate, updateSalesman);
router.delete('/salesman/:id', deleteSalesman);

module.exports = router;
