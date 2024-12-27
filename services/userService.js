const User = require('../models/User');

// Find user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Find user by username
const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

// Find user by ID
const findUserById = async (id) => {
  return await User.findById(id);
};

// Create a new user
const createUser = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};

// Update user role
const updateUserRole = async (userId, role) => {
  const user = await User.findById(userId);
  if (user) {
    user.role = role;
    return await user.save();
  }
  return null;
};

module.exports = {
  findUserByEmail,
  findUserByUsername,
  findUserById,
  createUser,
  updateUserRole,
};
