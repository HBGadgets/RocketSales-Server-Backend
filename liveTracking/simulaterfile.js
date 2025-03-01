const Salesman = require("../models/Salesman");
const LiveData = require("../models/LiveData");
const { getSocketInstance } = require("../utils/socket.io"); 

const getSalesmanHistoryTracking = async (username) => {
    try {
        const salesman = await Salesman.findOne({ username })
            .select("-profileImage") 
            .populate("companyId", "companyName")
            .populate("branchId", "branchName")
            .populate("supervisorId", "supervisorName")
            .lean();

        if (!salesman) return null;

        const historyLiveData = await LiveData.find({ username })
            .sort({ timestamp: 1 }) 
            .lean();

        return { salesman, historyLiveData };
    } catch (error) {
        console.error("❌ Error fetching salesman history tracking:", error);
        return null;
    }
};

const trackSalesmanHistory = () => {
    const io = getSocketInstance();

    io.on("connection", (socket) => {
        console.log("✅ New user connected for history tracking:", socket.id);

        socket.on("requestSalesmanHistory", async (username) => {
            console.log(`✅ History tracking requested for: ${username}`);

            const trackingHistory = await getSalesmanHistoryTracking(username);

            if (!trackingHistory || !trackingHistory.historyLiveData.length) {
                socket.emit("salesmanHistoryData", { error: "No history data found" });
                return;
            }

            let index = 0;
            const historyData = trackingHistory.historyLiveData;

            // Function to send data one by one
            const sendHistoricalData = () => {
                if (index < historyData.length) {
                    socket.emit("salesmanHistoryData", { 
                        ...trackingHistory.salesman, 
                        ...historyData[index] 
                    });
                    index++;
                } else {
                    clearInterval(intervalId); // Stop when all data is sent
                }
            };

            // Send data every 5 seconds (adjust interval as needed)
            const intervalId = setInterval(sendHistoricalData, 5000);

            // Clear interval when user disconnects
            socket.on("disconnect", () => {
                console.log(`❌ Stopped history tracking for: ${username}`);
                clearInterval(intervalId);
            });
        });
    });
};

module.exports = trackSalesmanHistory;
