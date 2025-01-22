const Branch = require("../models/Branch");
const Company = require("../models/Company"); 
const findSameUsername = require("../utils/findSameUsername");
const Supervisor = require("../models/Supervisor");
const User = require("../models/User");
const mongoose = require('mongoose');
const Salesman = require("../models/Salesman");
const { decrypt, encrypt } = require("../utils/cryptoUtils");



                // Add a Branch to a Company

exports.addBranch = async (req, res) => {
 
  const {
    companyId,
    branchName,
    branchLocation,
    branchEmail,
    branchPhone,
    supervisorsIds,
    username,
    password,
  } = req.body;

  try {
    const findCompany = await Company.findById(companyId);
    // const findBranch = await Branch.findOne({username})

    if (!findCompany) {
      return res.status(404).json({ message: "Company not found" });
    }
    const existingUserByUsername = await findSameUsername(username);
    if (existingUserByUsername.exists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newBranch =  new Branch ({
      companyId,
      branchName,
      branchLocation,
      branchEmail,
      branchPhone,
      supervisorsIds,
      username,
      password,
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
         Branches = await Branch.find().populate("companyId","companyName");
      }else if(role =='company'){
         Branches = await Branch.find({companyId: new ObjectId(id)}).populate("companyId","companyName");
      }

    if (!Branches) {
      return res.status(404).json({ message: "Branches not found" });
    }

    Branches.forEach(branch => {
      const decryptedPassword = decrypt(branch.password);
      branch.password = decryptedPassword;
    });

    res.status(200).json({ Branches});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Update a Branch
exports.updateBranch = async (req, res) => {
  const { id } = req.params;
    const {
      companyId,
      branchName,
      branchLocation,
      branchEmail,
      branchPhone,
      supervisorsIds,
      username,
      password,
    } = req.body;

  try {
        const currentBranch = await Branch.findById(id);
    
      if(username&& username !== currentBranch.username){
        const alreadyExistUser = await findSameUsername(username);
        if(alreadyExistUser.exists){
          return res.status(404).json({ message: "Username already exist" });
        }
      }

      let changedpassword;

      if (password) {
        const isPasswordChanged =
          !currentBranch.password || decrypt(currentBranch.password) !== password;
      
        if (isPasswordChanged) {
          changedpassword = encrypt(password);
        }
      }

    const updatedBranch = await Branch.findByIdAndUpdate(id,{
      companyId,
      branchName,
      branchLocation,
      branchEmail,
      branchPhone,
      supervisorsIds,
      username,
      password:changedpassword,

    },{ new: true,                                                            
      runValidators: true,
       });
    if (!updatedBranch) {
      return res.status(404).json({ message: "Branch not found for update" });
    }

      const companyIdObjectId = new mongoose.Types.ObjectId(companyId);
      const BranchIdObjectId = new mongoose.Types.ObjectId(id);

    if(companyId){

        await Supervisor.updateMany({branchId:BranchIdObjectId}, { $set: { companyId:companyIdObjectId} } )
        await Salesman.updateMany({branchId:BranchIdObjectId}, { $set: { companyId: companyIdObjectId} } )
        
    }

    res.status(200).json({
        message: "Branch updated successfully",
        updatedBranch,
      });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Delete a Branch
exports.deleteBranch = async (req, res) => {
  const { id } = req.params;

  const ObjectId = mongoose.Types.ObjectId;

  try {

    const deletedBranch = await Branch.findByIdAndDelete(id);
    if (!deletedBranch) {
      return res.status(404).json({ message: "Branch not found for delete" });
    }

    await Supervisor.deleteMany({branchId: new ObjectId(id)});
    await Salesman.deleteMany({branchId: new ObjectId(id)});


    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
