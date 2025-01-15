const express = require('express');
const {createCompany,updateCompany,deleteCompany,getAllCompanies,getCompanies,getCompanyByUsername,getAllBranches,getAllSupervisors,getAllSalesman} = require('../controllers/companyController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

          // Route for creating a new company
router.post('/create-company',authenticate, createCompany);


          // Route for getting companies
router.get('/get-companies',authenticate, getCompanies);






// Update company 
router.put('/update-company/:id',authenticate, updateCompany);

// Delete company
router.delete('/delete-company/:id',authenticate, deleteCompany);

// Route for fetching all companies
router.get('/get-companies-collection', getAllCompanies);
// Route for fetching all companies

// Route for fetching a company by username
router.get('/get-company/:username', getCompanyByUsername);


// Route to get all branches of all companies
router.get('/branches',authenticate, getAllBranches);
// Route to get all supervisors
router.get('/supervisors',authenticate, getAllSupervisors);
// Route to get all supervisors
router.get('/salesmans',authenticate, getAllSalesman);
 
module.exports = router;
