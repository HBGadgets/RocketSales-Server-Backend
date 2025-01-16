const Company = require("../models/Company");
const Salesman = require("../models/Salesman");
const User = require("../models/User");
const mongoose = require("mongoose");
const findSameUsername = require("../utils/findSameUsername");

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
      salesmandata = await Salesman.find().populate("companyId","companyName").populate("branchId","branchName").populate("supervisorId","supervisorName");
      console.log(salesmandata);
    } else if (role == "company") {
      salesmandata = await Salesman.find({ companyId: new ObjectId(id) });
    }else if (role == "branch"){
      salesmandata = await Salesman.find({ branchId: new ObjectId(id) });
    }else if(role == "supervisor"){

    }
    if (!salesmandata) {
      return res.status(404).json({ message: "Salesman not found" });
    }
    res.status(200).json({ salesmandata});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Salesman
exports.updateSalesman = async (req, res) => {
  const { companyId, branchId, supervisorId, salesmanId } = req.params;
  const {
    salesmanName,
    salesmanEmail,
    salesmanPhone,
    salesmanUsername,
    salesmanPassword,
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

    const supervisor = branch.supervisors.id(supervisorId);
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    const salesman = supervisor.salesmen.id(salesmanId);
    if (!salesman) {
      return res.status(404).json({ message: "Salesman not found" });
    }
    // Check if the new username already exists in User collection
    if (salesmanUsername !== salesman.salesmanUsername) {
      const existingUserByUsername = await User.findOne({
        username: salesmanUsername,
      });
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }
    // const salesmanEmail = `${salesmanUsername}@salesman.com`;
    const oldUsername = salesman.salesmanUsername;

    salesman.salesmanName = salesmanName || salesman.salesmanName;
    salesman.salesmanEmail = salesmanEmail || salesman.salesmanEmail;
    salesman.salesmanPhone = salesmanPhone || salesman.salesmanPhone;
    salesman.salesmanUsername = salesmanUsername || salesman.salesmanUsername;
    salesman.salesmanPassword = salesmanPassword || salesman.salesmanPassword;

    await company.save();
    const user = await User.findOne({ username: oldUsername });
    if (user) {
      user.username = salesmanUsername;
      user.password = salesmanPassword;
      user.email = salesmanEmail;
      await user.save();
    }

    res
      .status(200)
      .json({ message: "Salesman updated successfully", salesman });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Salesman
exports.deleteSalesman = async (req, res) => {
  const { companyId, branchId, supervisorId, salesmanId } = req.params;

  try {
    // Find the company by ID
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Find the branch by ID
    const branch = company.branches.id(branchId);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // Find the supervisor by ID
    const supervisor = branch.supervisors.id(supervisorId);
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }
    const salesman = supervisor.salesmen.id(salesmanId);
    if (!salesman) {
      return res.status(404).json({ message: "Salesman not found" });
    }
    await User.deleteOne({ username: salesman.salesmanUsername });
    // Remove the salesman from the salesmen array
    supervisor.salesmen = supervisor.salesmen.filter(
      (salesman) => salesman._id.toString() !== salesmanId
    );

    // Save the updated company document
    await company.save();

    res.status(200).json({ message: "Salesman deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
