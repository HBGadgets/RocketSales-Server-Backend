const { getSocketInstance } = require("../utils/socket.io"); 
const  {getLiveSalesmanData}  = require("./mergeSalesmanAndLiveData");

// let liveData
// // Fetch data every 10 seconds
// setInterval(async () => {
//     liveData = await getLiveSalesmanData();
//     // console.log("🔄 Fetched and merged live salesman data:", liveData);
// }, 5000);


const sendDataToAdmins = async () => {
    try {
        const io = getSocketInstance();

        const liveData = await getLiveSalesmanData();

        if (!liveData || liveData.length === 0) {
            console.log("No live data available to send.");
            return;
        }

       
        io.emit("liveSalesmanData", liveData); 
        


        console.log("📤 Sent live location data to admins.");
    } catch (error) {
        console.error("❌ Error sending live data:", error);
    }
};

module.exports = { sendDataToAdmins };
