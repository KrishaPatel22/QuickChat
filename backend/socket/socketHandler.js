// socket/socketHandler.js - Real-Time Socket.IO Logic
const { Server } = require("socket.io");

// Map to track online users: userId -> socketId
const onlineUsers = new Map();

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // ─── User comes online ───────────────────────────────────────────
    socket.on("user:online", (userId) => {
      onlineUsers.set(userId, socket.id);
      // Broadcast updated online users list to everyone
      io.emit("users:online", Array.from(onlineUsers.keys()));
      console.log(`✅ User online: ${userId} | Total: ${onlineUsers.size}`);
    });

    // ─── Private message ─────────────────────────────────────────────
    socket.on("message:send", ({ message, receiverId }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        // Send message to receiver
        io.to(receiverSocket).emit("message:receive", message);
        // Send notification to receiver
        io.to(receiverSocket).emit("notification:new", {
          senderId: message.sender._id,
          senderName: message.sender.username,
          content: message.content,
        });
      }
    });

    // ─── Typing indicators ───────────────────────────────────────────
    socket.on("typing:start", ({ senderId, receiverId }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("typing:start", { senderId });
      }
    });

    socket.on("typing:stop", ({ senderId, receiverId }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("typing:stop", { senderId });
      }
    });

    // ─── Mark messages as read ───────────────────────────────────────
    socket.on("messages:read", ({ senderId, receiverId }) => {
      const senderSocket = onlineUsers.get(senderId);
      if (senderSocket) {
        io.to(senderSocket).emit("messages:read", { receiverId });
      }
    });

    // ─── Disconnect ──────────────────────────────────────────────────
    socket.on("disconnect", () => {
      // Find and remove user from online map
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit("users:online", Array.from(onlineUsers.keys()));
          console.log(`❌ User offline: ${userId} | Total: ${onlineUsers.size}`);
          break;
        }
      }
    });
  });

  return io;
};

const getIO = () => io;

module.exports = { initSocket, getIO };