const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Emergency", "Warning", "Assignment", "Resource", "System"],
    default: "System",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Can be null if global broadcast, but good practice to target users
  },
  read: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
