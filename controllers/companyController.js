//controller/company/controller.js
const { default: mongoose } = require("mongoose");
const Branch = require("../models/Branch");
const Company = require("../models/Company");
const User = require("../models/User");
const Supervisor = require("../models/Supervisor");

            // Create a new company
exports.createCompany = async (req, res) => {

        const user = req.user.role;
  const {
    companyName,
    companyEmail,
    companyPhone,
    ownerName,
    ownerEmail,
    gstNo,
    panNo,
    businessType,
    branchesIds,
    username,
    password,
  } = req.body;

  try {
    
    const existingUserByUsername = await Company.findOne({ username: username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

  
    const newCompany = new Company({
      companyName,
      companyEmail,
      companyPhone,
      ownerName,
      ownerEmail,
      gstNo,
      panNo,
      businessType,
      branchesIds,
      username,
      password, 
      role:2
    });

    const company = await newCompany.save();
   
    res.status(201).json({
      company: company,
     
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

          // Get only companies without branches
exports.getCompanies = async (req, res) => {
  try {
    
    const companies = await Company.find()
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

          // Update companies
exports.updateCompany = async (req, res) => {
  const { id } = req.params; 
  const  updates= req.body;

  try {
 
    const company = await Company.findOneAndUpdate({_id:id},updates,
      { new: true,
      runValidators: true,
    });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ message: 'Company and associated user updated successfully', company });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

        // Delete company and associated Branch, Supervisor , Salesman
exports.deleteCompany = async (req, res) => {
  const { id } = req.params; 

  const ObjectId = mongoose.Types.ObjectId;

  try {
 
    const company = await Company.findOneAndDelete(id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found for delete' });
    }else{
        await Branch.deleteMany({companyId: new ObjectId(id)});
        await Supervisor.deleteMany({companyId: new ObjectId(id)});
        await Salesman.deleteMany({companyId: new ObjectId(id)});
    }

    res.status(200).json({ message: 'Company and associated Branch deleted'});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


