const Setoverspeed = require("../models/OverSpeed");



exports.setOverSpeed = async(req, res) => {
        try {
            const { supervisorId, speedLimit } = req.body;

            const existingEntry = await Setoverspeed.findOne({ supervisorId });
            if (existingEntry) {
                return res.status(400).json({ message: "Supervisor can only add one overspeed entry." });
            }

            const newOverSpeed = new Setoverspeed({
                supervisorId,
                speedLimit,
            });

            await newOverSpeed.save();
            res.status(201).json({ message: "Overspeed set successfully.", data: newOverSpeed });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
}


