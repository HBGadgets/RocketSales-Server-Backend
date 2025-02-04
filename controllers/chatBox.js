const ChatMessage = require("../models/ChatMessage");
const initializeSocket = require("../utils/socket.io");
const {encryptMessage} = require("../utils/messageCryptoUtils");

const secretKey = process.env.SECRET_KEY || "12345678901234567890098765432123"

let io;

const setupChatbox = (server) => {
    if (!io) {
        io = initializeSocket(server);

        io.on("connection", (socket) => {
            // console.log(`User Connected: ${socket.id}`);

            // Handle joining room
            socket.on("joinRoom", ({ room, username }) => {
                if (!room || !username) {
                    // console.error(" Room or username missing!");
                    return;
                }
                socket.join(room);
                // console.log(`[✅ ${username}] joined room: ${room}`);
            });

            // Handle sending messages
            socket.on("sendMessage", async (data) => {
                if (!data?.room || !data?.message || !data?.sender || !data?.receiver) {
                    // console.error("Invalid message data received:", data);
                    return;
                }

            const encryptedMessage = encryptMessage(data.message, secretKey);

                try {
                    const saveMessage = new ChatMessage({
                        Message: encryptedMessage,
                        sender: data.sender,
                        receiver: data.receiver,
                        room: data.room,
                    });
                    await saveMessage.save();

                    // console.log(`[${data.sender}] -> Room: ${data.room} | Msg: ${data.message}`);
                    io.to(data.room).emit("receiveMessage", data); 
                } catch (error) {
                    console.error("Error saving message to DB:", error);
                }
            });

          
            socket.on("disconnect", () => {
                console.log(`User Disconnected: ${socket.id}`);
            });
        });
    }
};

module.exports = setupChatbox;
