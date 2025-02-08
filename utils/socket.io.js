const { Server } = require("socket.io");

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"]
        }
    });

    // io.on("connection", (socket) => {
    //     console.log(`[${new Date().toISOString()}] User Connected: ${socket.id}`);

       
    //     socket.on("joinRoom", ({ room, username }) => {
    //         if (!room || !username) {
    //             console.error("Room or username missing!");
    //             return;
    //         }
    //         socket.join(room);
    //         console.log(`[${username}] joined room: ${room}`);
    //     });

       
    //     socket.on("sendMessage", (data) => {
    //         if (!data.room || !data.message || !data.sender) {
    //             console.error("Invalid message data received:", data);
    //             return;
    //         }
    //         console.log(`[${data.sender}] Message in ${data.room}: ${data.message}`);
    //         io.to(data.room).emit("receiveMessage", data); // Broadcast message to the room
    //     });

    //     // Handle disconnection
    //     socket.on("disconnect", () => {
    //         console.log(`[${new Date().toISOString()}] User Disconnected: ${socket.id}`);
    //     });
    // });

    return io;
};

module.exports = initializeSocket;
