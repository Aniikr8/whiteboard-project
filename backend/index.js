const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// ⚙️ Save drawing data
app.post("/api/save", (req, res) => {
  const { roomId, data } = req.body;
  const jsonData = JSON.stringify(data);
  const sql = "INSERT INTO drawings (room_id, data) VALUES (?, ?)";

  db.query(sql, [roomId, jsonData], (err, result) => {
    if (err) {
      console.error("❌ Error saving drawing:", err);
      return res.status(500).json({ message: "Save failed" });
    }
    res.json({ message: "Drawing saved" });
  });
});

// ⚙️ Load drawing data
app.get("/api/load/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  const sql = "SELECT data FROM drawings WHERE room_id = ? ORDER BY created_at DESC LIMIT 1";

  db.query(sql, [roomId], (err, results) => {
    if (err) {
      console.error("❌ Error loading drawing:", err);
      return res.status(500).json({ message: "Load failed" });
    }
    if (results.length > 0) {
      res.json(JSON.parse(results[0].data));
    } else {
      res.json([]); // No drawing yet
    }
  });
});

// Socket.io setup (unchanged)
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`📥 User ${socket.id} joined room ${roomId}`);
  });

  socket.on("start-draw", ({ roomId, offsetX, offsetY, color }) => {
    socket.to(roomId).emit("start-draw", { offsetX, offsetY, color });
  });

  socket.on("draw", ({ roomId, data }) => {
    socket.to(roomId).emit("draw", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
