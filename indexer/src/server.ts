import { Server } from "socket.io";
import express from "express"
import cors from "cors"
import { createServer } from "http";
import { startIndexer } from "./listeners/listeners";

export const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["POST", "GET"] },
  pingTimeout: 60000,
  pingInterval: 25000,
});



io.on("connection", (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);
  try {
    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });

  } catch (error: any) {
    console.error("❌ Connection error:", error);
    socket.emit("error", { message: error.message || "Internal server error", timestamp: Date.now() });
    socket.disconnect();
  }
})

server.listen(3001, async () => {
  console.log("Socket started!!!", 3001)
  await startIndexer(io); // start exactly once, at process startup
})


