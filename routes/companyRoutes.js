const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const {createCompany,updateCompany,getCompanies, deleteCompany} = require('../controllers/companyController');


// ---------------CRUD Api of architecture--------------------
router.post('/company',authenticate, createCompany);        
router.get('/company',authenticate, getCompanies);
router.put('/company/:id',authenticate, updateCompany);
router.delete('/company/:id',authenticate,deleteCompany );

 
module.exports = router;
