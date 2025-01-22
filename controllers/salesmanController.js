const Company = require("../models/Company");
const Salesman = require("../models/Salesman");
const User = require("../models/User");
const mongoose = require("mongoose");
const findSameUsername = require("../utils/findSameUsername");
const { decrypt, encrypt } = require("../utils/cryptoUtils");

// Add a Salesman
exports.addSalesman = async (req, res) => {
  const {
    salesmanName,
    salesmanEmail,
    salesmanPhone,
    username,
    password,
    companyId,
    branchId,
    supervisorId,
  } = req.body;

  try {
    const existingUserByUsername = await findSameUsername(username);
    if (existingUserByUsername.exists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salesmanId = new mongoose.Types.ObjectId();
    const newSalesman = new Salesman({
      _id: salesmanId,
      salesmanName,
      salesmanEmail,
      salesmanPhone,
      username,
      password,
      companyId,
      branchId,
      supervisorId,
      role: 5,
    });

    await newSalesman.save();

    res
      .status(201)
      .json({ message: "Salesman added successfully", salesman: newSalesman });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get All Salesmen
exports.getSalesmen = async (req, res) => {
  const { id } = req.user;
  const { role } = req.user;
  const ObjectId = mongoose.Types.ObjectId;
  let salesmandata;
  try {
    if (role == "superadmin") {
      salesmandata = await Salesman.find()
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        .populate("supervisorId", "supervisorName");
    } else if (role == "company") {
      salesmandata = await Salesman.find({ companyId: new ObjectId(id) })
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        .populate("supervisorId", "supervisorName");
    } else if (role == "branch") {
      salesmandata = await Salesman.find({ branchId: new ObjectId(id) })
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        .populate("supervisorId", "supervisorName");
    } else if (role == "supervisor") {
      salesmandata = await Salesman.find({ supervisorId: new ObjectId(id) })
        .populate("companyId", "companyName")
        .populate("branchId", "branchName")
        .populate("supervisorId", "supervisorName");
    }
    if (!salesmandata) {
      return res.status(404).json({ message: "Salesman not found" });
    }

    salesmandata?.forEach(salesman=>{
      const decryptedPassword  = decrypt(salesman.password);
      salesman.password = decryptedPassword;

     })

    res.status(200).json({ salesmandata });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Salesman
exports.updateSalesman = async (req, res) => {
  const { id } = req.params;
  const {
    salesmanName,
    salesmanEmail,
    salesmanPhone,
    username,
    password,
    companyId,
    branchId,
    supervisorId,
  } = req.body;

  try {
    const currentSalesman = await Salesman.findById(id);
    if (username && username !== currentSalesman.username) {
      const existingUserByUsername = await findSameUsername(username);
      if (existingUserByUsername.exists) {
        return res.status(400).json({ message: "Username already exists" });
      }  
    }
    let changedpassword;

      if (password) {
        const isPasswordChanged =
          !currentSalesman.password || decrypt(currentSalesman.password) !== password;
      
        if (isPasswordChanged) {
          changedpassword = encrypt(password);
        }
      }
    
    
    const updatedSalesman = await Salesman.findByIdAndUpdate(
      id,
      {
    salesmanName,
    salesmanEmail,
    salesmanPhone,
    username,
    password:changedpassword,
    companyId,
    branchId,
    supervisorId,
      },
      { new: true, runValidators: true }
    );
    if (!updatedSalesman) {
      return res.status(404).json({ message: "Branch not found for update" });
    }
    

    res
      .status(200)
      .json({ message: "Salesman updated successfully", updatedSalesman });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Salesman
exports.deleteSalesman = async (req, res) => {
  const { id } = req.params;

  try {
    const salesman = await Salesman.findByIdAndDelete(id);
    if (!salesman) {
      return res.status(404).json({ message: "Salesman not found for delete" });
    }
    res.status(200).json({ message: "Salesman deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
