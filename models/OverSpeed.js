const mongoose = require('mongoose');
const { db1 }= require('../config/db'); 

const SetOverSpeedSchema = new mongoose.Schema({
    supervisorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supervisor",
        required: true,
        unique: true,
    },
    speedLimit: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

module.exports = db1.model('Setoverspeed', SetOverSpeedSchema);
