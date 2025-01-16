const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authMiddleware');
const {createCompany,updateCompany,deleteCompany,getCompanies} = require('../controllers/companyController');



          // Route for creating a new company
router.post('/create-company',authenticate, createCompany);

          // Route for getting companies
router.get('/get-companies',authenticate, getCompanies);

          // Update company 
router.put('/update-company/:id',authenticate, updateCompany);

          // Delete company
router.delete('/delete-company/:id',authenticate, deleteCompany);

 
module.exports = router;
