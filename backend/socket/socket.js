import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://picx-kzg6.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  path: "/socket.io/",
});

const userSocketMap = {}; //har userId => socketId hoga jab wo app use kregatabhi

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  //while login it will generate a socket id for this login userId
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User connected: userId: ${userId}, socketId: ${socket.id}`);

    // Emit online users immediately after connection
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  //logout the soccket id needs to be deleted
  socket.on("disconnect", () => {
    if (userId) {
      console.log(
        `User disconnected: userId: ${userId}, socketId: ${socket.id}`
      );
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, server, app };

//server.js me app server import krege baki ke modififction wahha krege
