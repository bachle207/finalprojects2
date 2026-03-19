import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  recipientEmail: { type: String, required: true },
  title: String,
  message: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", NotificationSchema);