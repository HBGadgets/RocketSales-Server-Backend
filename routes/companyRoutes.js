const express = require('express');
const companyController = require('../controllers/companyController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

// Route for creating a new company
router.post('/create-company', companyController.createCompany);

// Update company 
router.put('/update-company/:id', companyController.updateCompany);

// Delete company
router.delete('/delete-company/:id', companyController.deleteCompany);

// Route for fetching all companies
router.get('/get-companies-collection', companyController.getAllCompanies);
// Route for fetching all companies
router.get('/get-companies', companyController.getOnlyCompanies);

// Route for fetching a company by username
router.get('/get-company/:username', companyController.getCompanyByUsername);


// Route to get all branches of all companies
router.get('/branches',authenticate, companyController.getAllBranches);
// Route to get all supervisors
router.get('/supervisors',authenticate, companyController.getAllSupervisors);
// Route to get all supervisors
router.get('/salesmans',authenticate, companyController.getAllSalesman);
 
module.exports = router;
