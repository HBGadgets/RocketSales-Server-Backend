const Branch = require('../models/Branch');
const Company = require('../models/Company');
const Superadmin = require('../models/SuperAdmin');
const Supervisor = require('../models/Supervisor');
const Salesman = require('../models/Salesman');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register user

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUsername = await Superadmin.findOne({username});

    if (existingUsername){
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    const newUser = new Superadmin({ username, email, password, role});
     await newUser.save();
    res.status(201).json({ userId: newUser._id, role: newUser.role });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {

  const { username, password } = req.body;
  let user;

      if( username==null|| password==null){
        return res.status(400).json({ message: 'Please Enter Valid Detail' });
      }

  try {
    
    user = await Superadmin.findOne({username});
    if (!user) {
     
      user = await Company.findOne({username});

    } else if(!user){

      user = await Branch.findOne({username});

    }  else if(!user){

      user = await Supervisor.findOne({username});

    } else if(!user){

      user = await Salesman.findOne({username});

    }else if (!user){
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if(user.password !== password){

      return res.status(400).json({ message: 'Incorrect Pasword or email Id' });

    }

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

  const userId = req.user.id; 
  let user;
  try {

     user =  await Superadmin.findById(userId);
    
    if (!user) {
      
       user =  await User.findById(userId);
       if(!user){
         return res.status(404).json({ message: 'User not found' });
       }
    }

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
