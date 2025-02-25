const mongoose = require('mongoose');
const { db2 }= require('../config/db'); 


const liveDataSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true
  },
  batteryLevel:{
    type:String,
  },
  mobileNetwork:{
    type:String,
  },
  distance:{
    type:String,
  },
  speed:{
    type:String,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Bind schema to db2
const LiveData = db2.model('LiveData', liveDataSchema);

module.exports = LiveData;
