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
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: "https://edteksmartboard.vercel.app",
  credentials: true
}));

app.use(express.json());

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


app.get("/verify-paystack/:reference", async (req, res) => {

  const reference = req.params.reference;

  try {

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    res.send(response.data);

  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/paystack-webhook", express.json(), async (req, res) => {

  const event = req.body;

  if (event.event === "charge.success") {

    const paymentData = event.data;

    console.log("Payment received:", paymentData.reference);

  }

  res.sendStatus(200);
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
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});