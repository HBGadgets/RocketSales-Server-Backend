const express = require('express');
const companyController = require('../controllers/companyController');

const router = express.Router();

// Route for creating a new company
router.post('/create-company', companyController.createCompany);

// Update company 
router.post('/update-company/:id', companyController.updateCompany);

// Delete company
router.delete('/delete-company/:id', companyController.deleteCompany);

// Route for fetching all companies
router.get('/get-companies', companyController.getAllCompanies);

// Route for fetching a company by username
router.get('/get-company/:username', companyController.getCompanyByUsername);

module.exports = router;
