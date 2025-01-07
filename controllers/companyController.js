//controller/company/controller.js
const Company = require("../models/Company");
const User = require("../models/User");

// Create a new company
exports.createCompany = async (req, res) => {
  const {
    companyName,
    companyEmail,
    ownerName,
    ownerEmail,
    gstNo,
    panNo,
    businessType,
    branches,
    companyUsername,
    companyPassword,
  } = req.body;

  try {
    // Check if the email already exists in the Company collection (optional)
    const existingCompanyByEmail = await Company.findOne({ companyEmail });
    if (existingCompanyByEmail) {
      return res.status(400).json({ message: "Company with this email already exists" });
    }

    // Check if the username already exists in the User collection
    const existingUserByUsername = await User.findOne({ username: companyUsername });
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if the email already exists in the User collection
    const existingUserByEmail = await User.findOne({ email: companyEmail });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email already exists in the system" });
    }

    // Create a new company document
    const newCompany = new Company({
      companyName,
      companyEmail,
      ownerName,
      ownerEmail,
      gstNo,
      panNo,
      businessType,
      branches: [],
      companyUsername,
      companyPassword, // Plain password for now
    });

    // Save the company to the database
    const company = await newCompany.save();

    // Create a new user associated with this company
    const newUser = new User({
      username: companyUsername, // Use company username as the user's username
      email: companyEmail, // Use company email
      password: companyPassword, // Use company password
      role: 2, // Default role set to 2 (as requested)
    });

    // Save the new user
    await newUser.save();

    // Return the created company and user data as response
    res.status(201).json({
      company: company,
      user: {
        userId: newUser._id,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all companies  
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get only companies without branches
exports.getOnlyCompanies = async (req, res) => {
  try {
    // Exclude the `branches` field using .select()
    const companies = await Company.find().select('-branches');
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update companies & also in user collection
exports.updateCompany = async (req, res) => {
  const { id } = req.params; // The ID of the company to update (from params, not body)
  const {
    companyName,
    companyEmail,
    ownerName,
    ownerEmail,
    gstNo,
    panNo,
    businessType,
    branches,
    companyUsername,
    companyPassword,
  } = req.body;

  try {
    // Find the existing company by ID
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Save the old username and email for user search later
    const oldUsername = company.companyUsername;
    const oldEmail = company.companyEmail;
    /// Validate if the new username or email already exists in the User collection
    if (companyUsername && companyUsername !== oldUsername) {
      const existingUserByUsername = await User.findOne({ username: companyUsername });
      if (existingUserByUsername) {
        return res.status(400).json({ message: 'Username already exists in the system' });
      }
    }

    if (companyEmail && companyEmail !== oldEmail) {
      const existingUserByEmail = await User.findOne({ email: companyEmail });
      if (existingUserByEmail) {
        return res.status(400).json({ message: 'Email already exists in the system' });
      }
    }

    // Update the company details
    company.companyName = companyName || company.companyName;
    company.companyEmail = companyEmail || company.companyEmail;
    company.ownerName = ownerName || company.ownerName;
    company.ownerEmail = ownerEmail || company.ownerEmail;
    company.gstNo = gstNo || company.gstNo;
    company.panNo = panNo || company.panNo;
    company.businessType = businessType || company.businessType;
    company.branches = branches || company.branches;
    company.companyUsername = companyUsername || company.companyUsername;
    company.companyPassword = companyPassword || company.companyPassword;

    // Save the updated company
    await company.save();

    // Find the associated user by the old username
    const user = await User.findOne({ username: oldUsername });
    if (user) {
      user.username = companyUsername || user.username;
      user.password = companyPassword || user.password;
      user.email = companyEmail || user.email;
      await user.save();
    }else {
      return res.status(404).json({ message: 'Associated user not found in the system' });
    }

    res.status(200).json({ message: 'Company and associated user updated successfully', company });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete companies & also in user collection
exports.deleteCompany = async (req, res) => {
  const { id } = req.params; // The ID of the company to delete

  try {
    // Find the existing company by ID
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
     // Delete all associated users: branches, supervisors, and salesmen
     for (const branch of company.branches) {
      // For each branch, delete supervisors and their salesmen
      for (const supervisor of branch.supervisors) {
        // Delete all salesmen under the supervisor
        for (const salesman of supervisor.salesmen) {
          await User.deleteOne({ username: salesman.salesmanUsername });
        }

        // Delete the supervisor user
        await User.deleteOne({ username: supervisor.supervisorUsername });
      }

      // Delete the branch user
      await User.deleteOne({ username: branch.branchUsername });
    }

    // Find the associated user by companyUsername
    // const user = await User.findOne({ username: company.companyUsername });
    // if (user) {
    //   // Delete the associated user
    //   await user.deleteOne();
    // }
   // Delete the company user
      await User.deleteOne({ username: company.companyUsername });

    // Delete the company
    await company.deleteOne();

    res.status(200).json({ message: 'Company and associated user deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single company by username
exports.getCompanyByUsername = async (req, res) => {
  try {
    const company = await Company.findOne({ companyUsername: req.params.username });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------superadmin
// Get all branches of all companies
exports.getAllBranches = async (req, res) => {
  try {
    // Fetch all companies
    const companies = await Company.find({}, 'companyName branches');

    if (!companies.length) {
      return res.status(404).json({ message: 'No companies found' });
    }

    // Filter and map companies to extract branches
    const result = companies
      .filter(company => company.branches && company.branches.length > 0) // Exclude companies without branches
      .map(company => ({
        _id: company._id,
        companyName: company.companyName,
        branches: company.branches.map(branch => ({
          _id: branch._id,
          branchName: branch.branchName,
          branchLocation: branch.branchLocation,
          branchEmail:branch.branchEmail,
          branchPhone:branch.branchPhone,
          branchUsername:branch.branchUsername,
          branchPassword: branch.branchPassword
        })),
      }));

    if (!result.length) {
      return res.status(404).json({ message: 'No branches found' });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all supervisors of all companies and branches
exports.getAllSupervisors = async (req, res) => {
  try {
    // Fetch all companies with their branches and supervisors
    const companies = await Company.find({}, 'companyName _id branches.branchName branches._id branches.branchLocation branches.supervisors');

    if (!companies.length) {
      return res.status(404).json({ message: 'No companies found' });
    }

    // Filter and map to include only relevant branches with supervisors
    const result = companies
      .map(company => {
        // Map through branches, ensuring they have supervisors
        const branchesWithSupervisors = company.branches
          .map(branch => {
            const supervisors = branch.supervisors.filter(supervisor => supervisor); // Remove empty supervisors
            if (supervisors.length > 0) {
              return {
                _id: branch._id,  // Include branch ID
                branchName: branch.branchName,
                branchLocation: branch.branchLocation,
                supervisors: supervisors.map(supervisor => ({
                  _id: supervisor._id,  // Include supervisor ID
                  supervisorName: supervisor.supervisorName,
                  supervisorEmail: supervisor.supervisorEmail,
                  supervisorPhone: supervisor.supervisorPhone,
                  supervisorUsername: supervisor.supervisorUsername,
                  supervisorPassword: supervisor.supervisorPassword
                })),
              };
            }
            return null; // Skip this branch if no supervisors
          })
          .filter(branch => branch !== null); // Remove any branches that don't have supervisors

        // Exclude companies with no branches having supervisors
        if (branchesWithSupervisors.length === 0) return null;

        return {
          _id: company._id,  // Include company ID
          companyName: company.companyName,
          branches: branchesWithSupervisors,
        };
      })
      .filter(company => company !== null); // Remove companies that don't have any valid branches with supervisors

    if (!result.length) {
      return res.status(404).json({ message: 'No supervisors found in branches' });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllSalesman = async (req, res) => {
  try {
    // Fetch all companies with their branches, supervisors, and salesmen
    const companies = await Company.find(
      {},
      'companyName _id branches.branchName branches._id branches.branchLocation branches.supervisors.supervisorName branches.supervisors._id branches.supervisors.salesmen'
    );

    if (!companies.length) {
      return res.status(404).json({ message: 'No companies found' });
    }

    // Map through companies to extract branches, supervisors, and salesmen
    const result = companies
      .map(company => {
        // Map through branches
        const branchesWithSalesmen = company.branches
          .map(branch => {
            const supervisorsWithSalesmen = branch.supervisors
              .map(supervisor => {
                // Only include supervisors with salesmen
                const salesmen = supervisor.salesmen.filter(salesman => salesman); // Remove empty salesmen
                if (salesmen.length > 0) {
                  return {
                    _id: supervisor._id, // Supervisor ID
                    supervisorName: supervisor.supervisorName,
                    salesmen: salesmen.map(salesman => ({
                      _id: salesman._id, // Salesman ID
                      salesmanName: salesman.salesmanName,
                      salesmanEmail: salesman.salesmanEmail,
                      salesmanPhone: salesman.salesmanPhone,
                      salesmanUsername: salesman.salesmanUsername,
                      salesmanPassword: salesman.salesmanPassword,
                    })),
                  };
                }
                return null; // Skip supervisors without salesmen
              })
              .filter(supervisor => supervisor !== null); // Remove supervisors without salesmen

            // Only include branches with supervisors having salesmen
            if (supervisorsWithSalesmen.length > 0) {
              return {
                _id: branch._id, // Branch ID
                branchName: branch.branchName,
                branchLocation: branch.branchLocation,
                supervisors: supervisorsWithSalesmen,
              };
            }
            return null; // Skip branches without supervisors with salesmen
          })
          .filter(branch => branch !== null); // Remove branches without supervisors with salesmen

        // Exclude companies with no valid branches
        if (branchesWithSalesmen.length > 0) {
          return {
            _id: company._id, // Company ID
            companyName: company.companyName,
            branches: branchesWithSalesmen,
          };
        }
        return null; // Skip companies without valid branches
      })
      .filter(company => company !== null); // Remove companies without valid branches

    if (!result.length) {
      return res.status(404).json({ message: 'No salesmen found in any branch' });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};