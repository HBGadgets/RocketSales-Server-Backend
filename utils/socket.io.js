const { Server } = require("socket.io");

let io = null; // Store the single instance

const initializeSocket = (server) => {
    if (!io) { // Prevent reinitialization
        io = new Server(server, {
            cors: {
                origin: "*", 
                methods: ["GET", "POST"]
            }
        });
        console.log("✅ Socket.io initialized!");
    }
    return io;
};

const getSocketInstance = () => {
    if (!io) {
        throw new Error("Socket.io has not been initialized!");
    }
    return io;
};

module.exports = { initializeSocket, getSocketInstance };
