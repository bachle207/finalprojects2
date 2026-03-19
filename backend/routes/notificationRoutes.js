import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();
router.get("/:email", async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/read/:id", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Đã đọc" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;