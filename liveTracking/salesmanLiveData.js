// const initializeSocket = require("../utils/socket.io");
const { getSocketInstance } = require("../utils/socket.io"); 
const findSameUsername = require("../utils/findSameUsername");

const LiveData = require('../models/LiveData'); 


// let io;


const saveLocationToDatabase = async (locationUpdate) => {
    try {
        // Save location update to MongoDB
        await LiveData.create(locationUpdate);
        // console.log("✅ Location saved successfully:", locationUpdate);
    } catch (error) {
        console.error("❌ Error saving location data:", error);
    }
};

 
// const setupLocationTracking = (server) => {
//      const io = getSocketInstance(); 
 
//      io.on("connection", (socket) => {
//          socket.on("registerUser", async ({ username }, callback) => {
//              if (!username) {
//                  if (callback) callback({ status: "error", message: "User Name is required!" });
//                  return;
//              }
 
//              try {
//                  const user = await findSameUsername(username);
//                  if (!user.exists) {
//                      if (callback) callback({ status: "error", message: "User does not exist!" });
//                      return;
//                  }
 
//                //   socket.userId = user._id;
//                //   console.log("aaaaaaaaaaaaaaa",socket.userId)
//                  if (callback) callback({ status: "success", message: "User exists, tracking enabled!" });
 
//                  socket.removeAllListeners("sendLocation");
 
//                  socket.on("sendLocation", async (data) => {
//                          // console.log("ddddddddddddddd",data)
//                     //  if (!socket.userId) return;
//                      if (!data?.latitude || !data?.longitude) return;
 
//                      try {
//                          const locationUpdate = {
//                             username: username,
//                              latitude: data.latitude,
//                              longitude: data.longitude,
//                              timestamp: new Date(),
//                          };
 
//                          await saveLocationToDatabase(locationUpdate);
//                      } catch (error) {}
//                  });
 
//              } catch (error) {
//                  if (callback) callback({ status: "error", message: "Database error!" });
//              }
//          });
 
//          socket.on("disconnect", () => {
//              delete socket.userId;
//          });
//      });
//  };

 
const setupLocationTracking = (server) => {
     const io = getSocketInstance(); 
 
     io.on("connection", (socket) => {
        socket.on("registerUser", async ({ username }) => {
            if (!username) {
                socket.emit("registerUserResponse", { status: "error", message: "User Name is required!" });
                return;
            }
        
            try {
                const user = await findSameUsername(username);
                if (!user.exists) {
                    socket.emit("registerUserResponse", { status: "error", message: "User does not exist!" });
                    return;
                }
        
                socket.emit("registerUserResponse", { status: "success", message: "User exists, tracking enabled!" });
        
                socket.removeAllListeners("sendLocation");
        
                socket.on("sendLocation", async (data) => {
                    if (!data?.latitude || !data?.longitude) return;
        
                    try {
                        const locationUpdate = {
                            username: username,
                            latitude: data.latitude,
                            longitude: data.longitude,
                            timestamp: new Date(),
                        };
        
                        await saveLocationToDatabase(locationUpdate);
                    } catch (error) {}
                });
        
            } catch (error) {
                socket.emit("registerUserResponse", { status: "error", message: "Database error!" });
            }
        });
 
         socket.on("disconnect", () => {
             delete socket.userId;
         });
     });
 };





 
 module.exports = setupLocationTracking;
 
 