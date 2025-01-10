const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

// Register user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await userService.findUserByEmail(email);
    const existingUsername = await userService.findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }else if (existingUsername){
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = await userService.createUser({ username, email, password, role });
    res.status(201).json({ userId: newUser._id, role: newUser.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find the user by username
    const user = await userService.findUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token with user ID, username, and role
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role,companyId:user.companyId,branchId:user.branchId,supervisorId:user.supervisorId,salesmanId:user.salesmanId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      message: "Successful Login",
      token,
      role: user.role, 
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the decoded JWT

    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user profile data (no password, only necessary fields)
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
