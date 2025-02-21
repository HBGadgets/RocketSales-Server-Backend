const mongoose = require('mongoose');
const { db1 }= require('../config/db'); 

const MessageSchema = new mongoose.Schema({
  Message: { type: String, },
  sender: {type:String }, 
  receiver: {type:String }, 
  room: {type:String },
}, { timestamps: true });

module.exports = db1.model('Message', MessageSchema);
