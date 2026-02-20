import express from 'express'
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "../api/routes/userRoutes.js";
import menuRoutes from "../api/routes/menuRoutes.js";
import cartRoutes from "../api/routes/cartRoutes.js";
import paymentRoutes from "../api/routes/paymentRoutes.js";
import dashboardRoutes from "../api/routes/revenuRoutes.js";
import notificationRoutes from "../api/routes/notificationRoutes.js";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@cluster0.qktbuuz.mongodb.net/`
  )
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((error) => console.log("Error connecting to MongoDB", error));


app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1hr",
  });
  res.send({ token });
});


app.use("/users", userRoutes);
app.use("/menu", menuRoutes);
app.use("/carts", cartRoutes);
app.use("/payments", paymentRoutes);
app.use("/dashboard-data", dashboardRoutes);
app.use("/notifications", notificationRoutes);

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", ({ room }) => {
    socket.join(room);
  });

  socket.on("message", (msg) => {
    io.to(msg.room).emit("message", msg);
  });

  socket.on("new-notification", (data) => {
    console.log("New notification broadcast:", data?.title || "Untitled");
    io.emit("new-notification", data);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});