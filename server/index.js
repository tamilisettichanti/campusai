import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);

import noticeRoutes from "./routes/notices.js";
app.use("/api/notices", noticeRoutes);

import notesRoutes from "./routes/notes.js";
app.use("/api/notes", notesRoutes);

import canteenRoutes from "./routes/canteen.js";
app.use("/api/canteen", canteenRoutes);

import lostFoundRoutes from "./routes/lostFound.js";
app.use("/api/lostfound", lostFoundRoutes);

import attendanceRoutes from "./routes/attendance.js";
app.use("/api/attendance", attendanceRoutes);

import chatRoutes from "./routes/chat.js";
app.use("/api/chat", chatRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "CampusAI Server is Running 🚀" });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));
// Socket.io
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export { io };