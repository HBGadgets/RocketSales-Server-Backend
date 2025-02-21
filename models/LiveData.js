const mongoose = require('mongoose');
const { db2 }= require('../config/db'); 


const liveDataSchema = new mongoose.Schema({
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
