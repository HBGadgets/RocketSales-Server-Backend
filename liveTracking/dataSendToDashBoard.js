const { getSocketInstance } = require("../utils/socket.io"); 
const  {getLiveSalesmanData}  = require("./mergeSalesmanAndLiveData");
const jwt = require("jsonwebtoken");



// const sendDataToAdmins = async () => {
//     try {
//         const io = getSocketInstance();

//         const liveData = await getLiveSalesmanData();

//         if (!liveData || liveData.length === 0) {
//             console.log("No live data available to send.");
//             return;
//         }

       
//         io.emit("liveSalesmanData", liveData); 
        


//         // console.log("📤 Sent live location data to admins.");
//     } catch (error) {
//         console.error("❌ Error sending live data:", error);
//     }
// };



const sendDataToAdmins = () => {
    const io = getSocketInstance();

    io.on("connection", (socket) => {
        console.log("✅ New user connected for Live Data:", socket.id);

        socket.on("authenticate", async (token) => {
            // console.log("jjjjjjjjjjjjjjj",token)
            if (!token) {
                console.log("❌ No token provided.");
                return;
            }

            let user;
            try {
                user = jwt.verify(token, process.env.JWT_SECRET);
            } catch (error) {
                console.error("❌ Invalid token:", error);
                return;
            }

            console.log("✅ Authenticated User:", user);

            const sendFilteredData = async () => {
                const liveData = await getLiveSalesmanData();

                if (!liveData || liveData.length === 0) {
                    console.log("⚠️ No live data available.");
                    return;
                }

                let filteredData = [];
                if (user.role == 1) {
                    filteredData = liveData;
                } else if (user.role == 2) {
                    filteredData = liveData.filter(item => item.companyId._id.toString() === user.id);
                } else if (user.role == 3) {
                    filteredData = liveData.filter(item => item.branchId._id.toString() === user.id);
                } else if (user.role == 4) {
                    filteredData = liveData.filter(item => item.supervisorId._id.toString() === user.id);
                } else {
                    console.log("❌ Unrecognized role. No data sent.");
                    return;
                }

                socket.emit("liveSalesmanData", filteredData);
            };

            // Send data every 10 seconds
            const intervalId = setInterval(sendFilteredData, 10000);

            // Stop sending data when the user disconnects
            socket.on("disconnect", () => {
                console.log(`❌ User disconnected from live data: ${socket.id}`);
                clearInterval(intervalId);
            });
        });
    });
};



module.exports = { sendDataToAdmins };
