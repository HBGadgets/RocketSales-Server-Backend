const express = require('express');
const authenticate = require('../middlewares/authMiddleware');
const Company = require('../models/Company');
const Branch = require('../models/Branch');
const Supervisor = require('../models/Supervisor');
const Salesman = require('../models/Salesman');
const ChatMessage = require('../models/ChatMessage');
const { decryptMessage } = require('../utils/messageCryptoUtils');
const router = express.Router();



router.get('/chatboxuser',authenticate,  async (req, res) => { 
     
         const { role,id } = req.user;
     
             let UserData;
         try {
                  if (role == "superadmin") {
                       UserData = await Company.find()
                       
                     } else if (role == "company") {
                         UserData = await Branch.find({companyId:id})
                         
                     } else if (role == "branch") {
                         UserData = await Supervisor.find({branchId:id})
                         
                     } else if (role == "supervisor") {
                         UserData = await Salesman.find({supervisorId:id})
                         
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


router.get('/userprechatmessage/:room', authenticate, async (req, res) => {
    const { room } = req.params;

    if (!room) {
        return res.status(400).json({ error: "Room is required" });
    }

    try {
        const messages = await ChatMessage.find({ room });

        const decryptedMessages = messages.map(msg => {
            if (!msg.Message) {
                return { ...msg._doc, Message: "Error: Missing Message" };
            }
        
            try {
                const decryptedText = decryptMessage(msg.Message);
                return { ...msg._doc, Message: decryptedText };
            } catch (error) {
                console.error("🚨 Decryption Error:", error.message);
                return { ...msg._doc, Message: "Error: Failed to decrypt" };
            }
        });
        
        res.status(200).json({ success: true, data: decryptedMessages });

    } catch (error) {
        res.status(500).json({ error: "Error fetching messages" });
    }
});




module.exports = router;