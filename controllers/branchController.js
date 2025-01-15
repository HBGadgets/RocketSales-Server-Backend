const Branch = require("../models/Branch");
const Company = require("../models/Company"); 
const User = require("../models/User");
const mongoose = require('mongoose');



                // Add a Branch to a Company

exports.addBranch = async (req, res) => {
 
  const {
    companyId,
    branchName,
    branchLocation,
    branchEmail,
    branchPhone,
    username,
    password,
    supervisors
  } = req.body;

  try {
    const findCompany = await Company.findById(companyId);
    const findBranch = await Branch.findOne({username})

    if (!findCompany) {
      return res.status(404).json({ message: "Company not found" });
    }
    if (findBranch) {
      return res.status(404).json({ message: "Branch with this username already exist" });
    }

    const newBranch =  new Branch ({
      companyId,
      branchName,
      branchLocation,
      branchEmail,
      branchPhone,
      username,
      password,
      supervisors,
      role: 3,
    })
   
    await newBranch.save();
     
     res.status(201).json({ message: "Branch added successfully", branch: newBranch });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Branches of a Company
exports.getBranches = async (req, res) => {
  const { id } = req.user;
  const {role} = req.user;

  const ObjectId = mongoose.Types.ObjectId;
  let Branches;

  try {

      if(role=='superadmin'){
         Branches = await Branch.find();
      }else if(role =='company'){
         Branches = await Branch.find({companyId: new ObjectId(id)});
      }

    if (!Branches) {
      return res.status(404).json({ message: "Branches not found" });
    }

    res.status(200).json({ Branches});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Update a Branch
exports.updateBranch = async (req, res) => {
  const { companyId, branchId } = req.params;
    const {
      branchName,
      branchLocation,
      branchEmail,
      branchPhone,
      branchUsername,
      branchPassword
    } = req.body;

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const branch = company.branches.id(branchId);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    // Check if the new username already exists in User collection
    if (branchUsername !== branch.branchUsername) {
      const existingUserByUsername = await User.findOne({ username: branchUsername });
      if (existingUserByUsername) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }
    // const branchEmail = `${branchUsername}@branch.com`;
    const oldUsername = branch.branchUsername;

    branch.branchName = branchName || branch.branchName;
    branch.branchLocation = branchLocation || branch.branchLocation;
    branch.branchEmail = branchEmail || branch.branchEmail;
    branch.branchPhone = branchPhone || branch.branchPhone;
    branch.branchUsername = branchUsername || branch.branchUsername;
    branch.branchPassword = branchPassword || branch.branchPassword;

    await company.save();
     // Update User collection
     const user = await User.findOne({ username: oldUsername });
     if (user) {
       user.username = branchUsername;
       user.password = branchPassword;
       user.email = branchEmail;
      //  user.email = branch.branchEmail || `NA`;
       await user.save();
     }

    res
      .status(200)
      .json({
        message: "Branch updated successfully",
        branches: company.branches,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a Branch
exports.deleteBranch = async (req, res) => {
  const { companyId, branchId } = req.params;

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Find the branch by ID
    const branch = company.branches.id(branchId);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
     // Delete all associated supervisors and salesmen from User collection
     for (const supervisor of branch.supervisors) {
      for (const salesman of supervisor.salesmen) {
        await User.deleteOne({ username: salesman.salesmanUsername });
      }
      await User.deleteOne({ username: supervisor.supervisorUsername });
    }

    // Delete the branch user
    await User.deleteOne({ username: branch.branchUsername });

    // Clear supervisors to avoid potential duplicate key issues
    branch.supervisors = [];

    // Use pull to remove the branch from the company's branches array
    company.branches.pull(branchId);

    // Save the updated company
    await company.save();

    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
