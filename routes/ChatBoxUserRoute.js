const express = require('express');
const authenticate = require('../middlewares/authMiddleware');
const Company = require('../models/Company');
const Branch = require('../models/Branch');
const Supervisor = require('../models/Supervisor');
const Salesman = require('../models/Salesman');
const router = express.Router();



router.get('/chatboxuser',authenticate,  async (req, res) => { 
     
         const { role } = req.user;
     
             let UserData;
         try {
                  if (role == "superadmin") {
                       UserData = await Company.find()
                       
                     } else if (role == "company") {
                         UserData = await Branch.find()
                         
                     } else if (role == "branch") {
                         UserData = await Supervisor.find()
                         
                     } else if (role == "supervisor") {
                         UserData = await Salesman.find()
                         
                     }
                     if (!UserData) {
                         return res.status(404).json({ message: "User not found" });
                     }
                     res.status(200).json(UserData );
             
         } catch (error) {
             res.status(500).json({ message: error.message });
         }
     }

        )

module.exports = router;