const { default: mongoose } = require("mongoose");
const LiveData = require("../models/LiveData");
const Salesman = require("../models/Salesman");
const moment = require("moment");



// exports.getDistance = async (req, res) => { 
//      try {
//          const { salesmanId, startDate, endDate } = req.query;
 
//          if (!salesmanId || !startDate || !endDate) {
//              return res.status(400).json({ message: "Missing required parameters" });
//          }
 
//          const salesman = await Salesman.findById(salesmanId);
//          if (!salesman) {
//              return res.status(404).json({ message: "Salesman not found" });
//          }
 
        
//          const start = new Date(startDate);
//          const end = new Date(endDate);
 
    
//          const liveData = await LiveData.find({
//              username: salesman.username,
//              timestamp: { $gte: start, $lte: end },
//          }).sort({ timestamp: 1 });
 
//          if (!liveData.length) {
//              return res.status(404).json({ message: "No data found" });
//          }
 
//          // Calculate total distance
//          const totalDistance = liveData.reduce((acc, curr) => acc + (curr.distance || 0), 0);
 
//          // Get start & end points
//          const startPoint = liveData[0];
//          const endPoint = liveData[liveData.length - 1];
 
//          return res.json({
//              totalDistance: totalDistance.toFixed(2) + " km",
//              startPoint: { lat: startPoint.latitude, lon: startPoint.longitude },
//              endPoint: { lat: endPoint.latitude, lon: endPoint.longitude }
//          });
 
//      } catch (error) {
//          console.error("❌ Error calculating distance:", error);
//          return res.status(500).json({ message: "Internal server error" });
//      }
//  };
 




exports.getDistance = async (req, res) => { 
    try {
        const { id, period, startDate, endDate } = req.query;

        if (!id || !period) {
            return res.status(400).json({ message: "Missing required parameters" });
        }

        const salesman = await Salesman.findById(new mongoose.Types.ObjectId(id));

        if (!salesman) {
            return res.status(404).json({ message: "Salesman not found" });
        }

        let start, end;

        // Get current date and time
        const now = moment().endOf("day");

        switch (period.toLowerCase()) {
            case "today":
                start = moment().startOf("day");
                end = now;
                break;
            case "yesterday":
                start = moment().subtract(1, "day").startOf("day");
                end = moment().subtract(1, "day").endOf("day");
                break;
            case "thisweek":
                start = moment().startOf("week");
                end = now;
                break;
            case "prevweek":
                start = moment().subtract(1, "week").startOf("week");
                end = moment().subtract(1, "week").endOf("week");
                break;
            case "thismonth":
                start = moment().startOf("month");
                end = now;
                break;
            case "lastmonth":
                start = moment().subtract(1, "month").startOf("month");
                end = moment().subtract(1, "month").endOf("month");
                break;
            case "custom":
                if (!startDate || !endDate) {
                    return res.status(400).json({ message: "Start and end dates are required for custom period" });
                }
                start = moment(startDate);
                end = moment(endDate);
                break;
            default:
                return res.status(400).json({ message: "Invalid period type" });
        }

        // Fetch location data
        const liveData = await LiveData.find({
            username: salesman.username,
            timestamp: { $gte: start.toDate(), $lte: end.toDate() },
        }).sort({ timestamp: 1 });

        if (!liveData.length) {
            return res.status(404).json({ message: "No data found" });
        }

        // Calculate total distance
        const totalDistance = liveData.reduce((acc, curr) => acc + Number(curr.distance || 0), 0) / 1000;

        // Get start & end points
        const startPoint = liveData[0];
        const endPoint = liveData[liveData.length - 1];

        const distance = Number(totalDistance); 

        if (isNaN(distance)) {
            return res.status(500).json({ error: "Invalid distance calculation" });
        }

        return res.json({
            period,
            totalDistance: distance.toFixed(2) + " km", // Apply toFixed safely
            startPoint: { lat: startPoint.latitude, long: startPoint.longitude },
            endPoint: { lat: endPoint.latitude, long: endPoint.longitude }
        });

    } catch (error) {
        console.error("❌ Error calculating distance:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.getDistanceDayWise = async (req, res) => {
    try {
        const { id, period, startDate, endDate } = req.query;

        if (!id || !period) {
            return res.status(400).json({ message: "Missing required parameters" });
        }

        const salesman = await Salesman.findById(new mongoose.Types.ObjectId(id));

        if (!salesman) {
            return res.status(404).json({ message: "Salesman not found" });
        }

        let start, end;
        const now = moment().endOf("day");

        switch (period.toLowerCase()) {
            case "today":
                start = moment().startOf("day");
                end = now;
                break;
            case "yesterday":
                start = moment().subtract(1, "day").startOf("day");
                end = moment().subtract(1, "day").endOf("day");
                break;
            case "thisweek":
                start = moment().startOf("week");
                end = now;
                break;
            case "prevweek":
                start = moment().subtract(1, "week").startOf("week");
                end = moment().subtract(1, "week").endOf("week");
                break;
            case "thismonth":
                start = moment().startOf("month");
                end = now;
                break;
            case "lastmonth":
                start = moment().subtract(1, "month").startOf("month");
                end = moment().subtract(1, "month").endOf("month");
                break;
            case "custom":
                if (!startDate || !endDate) {
                    return res.status(400).json({ message: "Start and end dates are required for custom period" });
                }
                start = moment(startDate);
                end = moment(endDate);
                break;
            default:
                return res.status(400).json({ message: "Invalid period type" });
        }

        let dailyDistances = {};
        let currentDate = moment(start);

        while (currentDate.isSameOrBefore(end, "day")) {
            const dayStart = currentDate.clone().startOf("day");
            const dayEnd = currentDate.clone().endOf("day");

            const liveData = await LiveData.find({
                username: salesman.username,
                timestamp: { $gte: dayStart.toDate(), $lte: dayEnd.toDate() },
            }).sort({ timestamp: 1 });

            if (liveData.length > 0) {
                const totalDistance = liveData.reduce((acc, curr) => acc + Number(curr.distance || 0), 0) / 1000;
                dailyDistances[dayStart.format("YYYY-MM-DD")] = {
                    totalDistance: totalDistance.toFixed(2) + " km",
                    startPoint: { lat: liveData[0].latitude, long: liveData[0].longitude },
                    endPoint: { lat: liveData[liveData.length - 1].latitude, long: liveData[liveData.length - 1].longitude }
                };
            } else {
                dailyDistances[dayStart.format("YYYY-MM-DD")] = {
                    totalDistance: "0 km",
                    startPoint: null,
                    endPoint: null
                };
            }

            currentDate.add(1, "day");
        }

        return res.json({ period, dailyDistances });

    } catch (error) {
        console.error("❌ Error calculating distance:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


