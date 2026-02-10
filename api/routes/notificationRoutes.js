import express from "express";
import {
  getLatestNotification,
  createNotification,
  updateNotification,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/latest", getLatestNotification);
router.post("/", createNotification);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);

export default router;
