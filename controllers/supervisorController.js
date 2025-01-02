const Company = require('../models/Company');
const User = require("../models/User");


// Add a Supervisor
exports.addSupervisor = async (req, res) => {
    const { companyId, branchId } = req.params;
    const { supervisorName, supervisorUsername, supervisorPassword } = req.body;
  
    // Ensure supervisorUsername is provided
    if (!supervisorUsername) {
      return res.status(400).json({ message: 'Supervisor username is required' });
    }
  
    try {
      const company = await Company.findById(companyId);
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
  
      const branch = company.branches.id(branchId);
      if (!branch) {
        return res.status(404).json({ message: 'Branch not found' });
      }
  
      // Check if supervisor username already exists in the branch
      const existingSupervisor = branch.supervisors.find(
        (sup) => sup.supervisorUsername === supervisorUsername
      );
      if (existingSupervisor) {
        return res.status(400).json({ message: 'Supervisor username already exists' });
      }
      // Check if the username already exists in the User collection
      const existingUserByUsername = await User.findOne({ username: supervisorUsername });
      if (existingUserByUsername) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      // Check if the email already exists in the User collection (assuming email is generated)
      const supervisorEmail = `${supervisorUsername}@supervisor.com`;
      const existingUserByEmail = await User.findOne({ email: supervisorEmail });
      if (existingUserByEmail) {
        return res.status(400).json({ message: 'Email already exists in the system' });
      }
    
      const newSupervisor = {
        supervisorName,
        supervisorUsername,
        supervisorPassword,
        salesmen: [],
      };
  
      // Push the new supervisor to the branch's supervisors array
      branch.supervisors.push(newSupervisor);
      await company.save();
       // Add supervisor to User collection
    const newUser = new User({
      username: supervisorUsername,
      password: supervisorPassword,
      email: supervisorEmail,
      role: 4,
    });
    await newUser.save();
  
      res.status(201).json({ message: 'Supervisor added successfully', supervisor: newSupervisor });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};
  
// Get All Supervisors
exports.getSupervisors = async (req, res) => {
  const { companyId, branchId } = req.params;

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const branch = company.branches.id(branchId);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    res.status(200).json({ supervisors: branch.supervisors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Supervisor
exports.updateSupervisor = async (req, res) => {
  const { companyId, branchId, supervisorId } = req.params;
  const { supervisorName, supervisorUsername, supervisorPassword } = req.body;

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const branch = company.branches.id(branchId);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const supervisor = branch.supervisors.id(supervisorId);
    if (!supervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }
      // Check if the new username already exists in User collection
      if (supervisorUsername !== supervisor.supervisorUsername) {
        const existingUserByUsername = await User.findOne({ username: supervisorUsername });
        if (existingUserByUsername) {
          return res.status(400).json({ message: 'Username already exists' });
        }
      }
      const supervisorEmail = `${supervisorUsername}@supervisor.com`;
      const oldUsername = supervisor.supervisorUsername;
  
    supervisor.supervisorName = supervisorName || supervisor.supervisorName;
    supervisor.supervisorUsername = supervisorUsername || supervisor.supervisorUsername;
    supervisor.supervisorPassword = supervisorPassword || supervisor.supervisorPassword;

    await company.save();
     // Update User collection
     const user = await User.findOne({ username: oldUsername });
     if (user) {
       user.username = supervisorUsername;
       user.password = supervisorPassword;
       user.email = supervisorEmail;
       await user.save();
     }  
    res.status(200).json({ message: 'Supervisor updated successfully', supervisor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Supervisor
exports.deleteSupervisor = async (req, res) => {
  const { companyId, branchId, supervisorId } = req.params;

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const branch = company.branches.id(branchId);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Remove supervisor from the supervisors array
    branch.supervisors = branch.supervisors.filter(
      (supervisor) => supervisor._id.toString() !== supervisorId
    );

    // Save the updated company
    await company.save();

    res.status(200).json({ message: 'Supervisor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

