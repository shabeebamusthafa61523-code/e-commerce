require("dotenv").config();
const path = require("path");
const http = require("http"); // Required for Socket.io
const { Server } = require("socket.io"); // Required for Socket.io
const connectDB = require("./config/db");
const app = require("./app");
const express = require("express");

connectDB();

// 1. Create an HTTP Server using your Express app
const server = http.createServer(app);

// 2. Initialize Socket.io and attach it to the HTTP Server
const io = new Server(server, {
  cors: {
    origin: "*", // In production, replace with your Vercel URL
    methods: ["GET", "POST"]
  }
});

// 3. Socket.io logic
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join_riders_room", () => {
    socket.join("riders");
    console.log("Rider joined the room");
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

// 4. Pass 'io' to your controllers via middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

const PORT = process.env.PORT || 5000;

app.use("/uploads", express.static("uploads"));

// 5. IMPORTANT: Use server.listen, NOT app.listen
server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT} with WebSockets`);
});