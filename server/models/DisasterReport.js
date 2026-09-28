const mongoose = require("mongoose");

const disasterReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String, // Cloudinary URL
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  disasterType: {
    type: String,
    enum: ["Flood", "Fire", "Cyclone", "Earthquake", "Landslide", "Building Collapse", "Road Block"],
    required: true,
  },
  severity: {
    type: String,
    enum: ["High", "Medium", "Low"],
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
    },
    address: { type: String },
  },
  urgency: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  aiConfidence: {
    type: Number, // Percentage 0-100
  },
  aiVerified: {
    type: Boolean,
    default: false,
  },
  victimsCount: {
    type: Number,
    default: 0,
  },
  resourceNeeded: [
    { type: String } // e.g., "Food", "Water", "Medical", "Shelter"
  ],
  status: {
    type: String,
    enum: ["Pending AI Review", "Verified", "Team Assigned", "In Progress", "Resolved", "Fake"],
    default: "Pending AI Review",
  },
  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RescueTeam",
  }
}, { timestamps: true });

disasterReportSchema.index({ location: "2dsphere" });
disasterReportSchema.index({ status: 1 });
disasterReportSchema.index({ disasterType: 1 });
disasterReportSchema.index({ severity: 1 });

module.exports = mongoose.model("DisasterReport", disasterReportSchema);
