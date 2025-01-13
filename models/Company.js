//models/Company.js
const mongoose = require('mongoose');

const salesmanSchema = new mongoose.Schema({
  salesmanName: { type: String, required: true },
  salesmanEmail: { type: String,sparse: true, },
  salesmanPhone: { type: String, required: true },
  salesmanUsername: { type: String, required: true, unique: true,sparse: true, },
  salesmanPassword: { type: String, required: true },
});

const supervisorSchema = new mongoose.Schema({
  supervisorName: { type: String, required: true },
  supervisorEmail: { type: String, sparse: true,}, 
  supervisorPhone: { type: String, required: false }, 
  supervisorUsername: { type: String, required: true, unique: true, sparse: true, },
  supervisorPassword: { type: String, required: true },
  salesmen: [salesmanSchema], 
});

const branchSchema = new mongoose.Schema({
  branchName: { type: String, required: true },
  branchLocation: { type: String, required: true },
  branchEmail: { type: String, sparse: true,},
  branchPhone: { type: String, required: false }, 
  branchUsername: { type: String, required: true, unique: true,sparse: true, },
  branchPassword: { type: String, required: true },
  supervisors: [supervisorSchema], 
});

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },  
  companyEmail: { type: String },   
  companyPhone: { type: String, required: false},               
  ownerName: { type: String, required: true },     
  ownerEmail: { type: String,required: true },                    
  gstNo: { type: String },         
  panNo: { type: String },                         
  businessType: { type: String },                  
  branches: [branchSchema],                        
  companyUsername: { type: String, required: true, unique: true }, 
  companyPassword: { type: String, required: true },  
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Company', companySchema);
