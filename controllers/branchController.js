const Company = require("../models/Company"); // Ensure the model name has the correct casing
const User = require("../models/User");

// Add a Branch to a Company
exports.addBranch = async (req, res) => {
  const { companyId } = req.params;
  const { branchName, branchLocation, branchUsername, branchPassword } =
    req.body;

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const newBranch = {
      branchName,
      branchLocation,
      branchUsername,
      branchPassword,
      supervisors: [], // Initially empty supervisors array
    };
    // Check if branchName or branchUsername already exists in the company
    const existingBranch = company.branches.find(
      (branch) =>
        branch.branchName === branchName ||
        branch.branchUsername === branchUsername
    );
    if (existingBranch) {
      return res
        .status(400)
        .json({ message: "Branch name or username already exists" });
    }

    // Check if the username already exists in the User collection
    const existingUserByUsername = await User.findOne({
      username: branchUsername,
    });
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if the email already exists in the User collection (assuming email is generated)
    const branchEmail = `${branchUsername}@branch.com`;
    const existingUserByEmail = await User.findOne({ email: branchEmail });
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ message: "Email already exists in the system" });
    }
    company.branches.push(newBranch);
    await company.save();
      // Add branch to User collection
      const newUser = new User({
        username: branchUsername,
        password: branchPassword,
        email: branchEmail,
        role: 3,
      });
      await newUser.save();

    res
      .status(200)
      .json({ message: "Branch added successfully", branch: newBranch });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Branches of a Company
exports.getBranches = async (req, res) => {
  const { companyId } = req.params;

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ branches: company.branches });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a Branch
exports.updateBranch = async (req, res) => {
  const { companyId, branchId } = req.params;
  const { branchName, branchLocation, branchUsername, branchPassword } =
    req.body;

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
    const branchEmail = `${branchUsername}@branch.com`;
    const oldUsername = branch.branchUsername;

    branch.branchName = branchName || branch.branchName;
    branch.branchLocation = branchLocation || branch.branchLocation;
    branch.branchUsername = branchUsername || branch.branchUsername;
    branch.branchPassword = branchPassword || branch.branchPassword;

    await company.save();
     // Update User collection
     const user = await User.findOne({ username: oldUsername });
     if (user) {
       user.username = branchUsername;
       user.password = branchPassword;
       user.email = branchEmail;
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
