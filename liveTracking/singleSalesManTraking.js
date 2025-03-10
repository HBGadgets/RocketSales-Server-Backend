const Salesman = require("../models/Salesman");
const LiveData = require("../models/LiveData");
const { getSocketInstance } = require("../utils/socket.io"); 

const getSingleSalesmanTracking = async (username) => {
    try {
        const salesman = await Salesman.findOne({ username })
            .select("-profileImage") 
            .populate("companyId", "companyName")
            .populate("branchId", "branchName")
            .populate("supervisorId", "supervisorName")
            .lean();

        if (!salesman) return null;

        const latestLiveData = await LiveData.findOne({ username })
            .sort({ timestamp: -1 })
            .lean();

        return { ...salesman, ...(latestLiveData || {}) };
    } catch (error) {
        console.error("❌ Error fetching single salesman tracking:", error);
        return null;
    }
};

const trackSalesmanLive = () => {
    const io = getSocketInstance();

    io.on("connection", (socket) => {
        console.log("✅ New user connected for live tracking:", socket.id);

        socket.on("requestSalesmanTracking", async (username) => {
          console.log(`✅ Live tracking requested for: ${username}`);
      
          // Function to fetch and send tracking data repeatedly
          const sendLiveTrackingData = async () => {
              const trackingData = await getSingleSalesmanTracking(username);
              socket.emit("salesmanTrackingData", trackingData);
          };

          sendLiveTrackingData();
      
          // Send data every 10 seconds
          const intervalId = setInterval(sendLiveTrackingData, 10000);
      
          // Clear interval when user disconnects
          socket.on("disconnect", () => {
              console.log(`❌ Stopped tracking for: ${username}`);
              clearInterval(intervalId);
          });
      });

    });
};

module.exports = trackSalesmanLive;
