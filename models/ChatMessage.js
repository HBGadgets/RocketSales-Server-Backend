const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  Message: { type: String, },
  sender: {type:String }, 
  receiver: {type:String }, 
  room: {type:String },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
