import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import authRoutes from './routes/authRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'; 

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }
});

app.use(cors());
app.use(express.json());

connectDB();

let onlineUsers = [];
io.on("connection", (socket) => {
  socket.on("registerUser", (email) => {
    if (email && !onlineUsers.some(user => user.email === email)) {
      onlineUsers.push({ email, socketId: socket.id });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
  });
});

app.use((req, res, next) => {
  req.io = io;
  req.onlineUsers = onlineUsers;
  next();
});

app.use('/api/jobs', jobRoutes); 
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);

server.listen(5000, () => {
  console.log("Server đang chạy tại port 5000 có Socket.io");
});