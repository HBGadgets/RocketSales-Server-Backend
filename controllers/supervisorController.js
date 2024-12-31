const Company = require('../models/Company');

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
  
      const newSupervisor = {
        supervisorName,
        supervisorUsername,
        supervisorPassword,
        salesmen: [],
      };
  
      // Push the new supervisor to the branch's supervisors array
      branch.supervisors.push(newSupervisor);
      await company.save();
  
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

    supervisor.supervisorName = supervisorName || supervisor.supervisorName;
    supervisor.supervisorUsername = supervisorUsername || supervisor.supervisorUsername;
    supervisor.supervisorPassword = supervisorPassword || supervisor.supervisorPassword;

    await company.save();

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

