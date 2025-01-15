const jwt = require('jsonwebtoken');
const Branch = require('../models/Branch');
const Company = require('../models/Company');
const Supervisor = require('../models/Supervisor');
const Salesman = require('../models/Salesman');
const Superadmin = require('../models/SuperAdmin');

const authenticate = async(req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from headers

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


   let user;
    let sperr = false;
    user = await Superadmin.findById(decoded.id);
    if (user) {
      req.user = { id: decoded.id, role: 'superadmin'}; 
      sperr = true;
    } else if(!user) {
      user = await Company.findById(decoded.id);
      req.user = { id:decoded, role: 'company'}; 
      sperr = true;

    }
     else if(!user) {
      user = await Branch.findById(decoded.id);
      req.user = { id: user._id,role: 'branch'}; 
      sperr = true;
    
    } else if(!user) {
      user = await Supervisor.findById(decoded.id);
      req.user = { id: user._id, role: 'supervisor'}; 
      sperr = true;
    
    } else{
      user = await Salesman.findById(decoded.id);
      req.user = { id: user._id, role: 'salesman'}; 
      sperr = true;
    }
      
    if(!sperr){
      return res.status(404).json({ message: 'User not found' });
    }
    next();
  } catch (error) {
    
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;
