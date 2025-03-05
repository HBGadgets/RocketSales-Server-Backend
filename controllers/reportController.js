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
        const { usernames, period, startDate, endDate } = req.query;
        if (!usernames) return res.status(400).json({ message: "Missing required parameters: username" });

        const ArrUsernames = usernames.split(",").map(u => u.trim()); // Split and trim usernames

        const now = moment().endOf("day");
        let start, end;

        if (startDate && endDate) {
            start = moment(startDate).startOf("day");
            end = moment(endDate).endOf("day");
        } else {
            const periods = {
                today: [moment().startOf("day"), now],
                yesterday: [moment().subtract(1, "day").startOf("day"), moment().subtract(1, "day").endOf("day")],
                thisweek: [moment().startOf("week"), now],
                prevweek: [moment().subtract(1, "week").startOf("week"), moment().subtract(1, "week").endOf("week")],
                thismonth: [moment().startOf("month"), now],
                lastmonth: [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
            };
            [start, end] = periods[period?.toLowerCase()] || [];
            if (!start || !end) return res.status(400).json({ message: "Invalid period type or missing dates" });
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(`{"period": "${period}", "salesmanDistances": {`);

        let firstUser = true;
        for (const user of ArrUsernames) {
            if (!firstUser) res.write(",");
            res.write(`"${user}": {`);
            firstUser = false;

            let currentDate = moment(start);
            let firstDay = true;

            while (currentDate.isSameOrBefore(end, "day")) {
                if (!firstDay) res.write(",");
                firstDay = false;

                const dayStart = currentDate.clone().startOf("day").toDate();
                const dayEnd = currentDate.clone().endOf("day").toDate();

                let totalDistance = 0, startPoint = null, endPoint = null;
                const cursor = LiveData.find({
                    username: user,
                    timestamp: { $gte: dayStart, $lte: dayEnd }
                }).sort({ timestamp: 1 }).select('-_id latitude longitude distance').lean().cursor();

                let firstRecord = true;
                for await (const { latitude, longitude, distance } of cursor) {
                    totalDistance += Number(distance || 0);
                    if (firstRecord) {
                        startPoint = { lat: latitude, long: longitude };
                        firstRecord = false;
                    }
                    endPoint = { lat: latitude, long: longitude };
                }

                res.write(`"${currentDate.format("YYYY-MM-DD")}": {`);
                res.write(`"totalDistance": "${(totalDistance / 1000).toFixed(2)} km",`);
                res.write(`"startPoint": ${JSON.stringify(startPoint)},`);
                res.write(`"endPoint": ${JSON.stringify(endPoint)}}`);

                currentDate.add(1, "day");
            }
            res.write("}");
        }

        res.write("}}}\n");
        res.end();
    } catch (error) {
        console.error("❌ Error calculating distance:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

