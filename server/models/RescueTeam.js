const mongoose = require("mongoose");

const rescueTeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  leaderName: {
    type: String,
    required: true,
  },
  members: [
    { type: String }
  ],
  vehicle: {
    type: String,
  },
  contact: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Available", "On Mission", "Offline"],
    default: "Available",
  },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
  },
  assignedReports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DisasterReport",
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("RescueTeam", rescueTeamSchema);
