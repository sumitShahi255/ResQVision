const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Hospital", "Shelter", "Food Camp", "Water Tank", "Ambulance", "Police", "NGO", "Fire Station"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
  },
  capacity: {
    type: Number,
    default: 0,
  },
  available: {
    type: Number,
    default: 0,
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
  status: {
    type: String,
    enum: ["Active", "Full", "Closed", "Busy"],
    default: "Active",
  }
}, { timestamps: true });

resourceSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Resource", resourceSchema);
