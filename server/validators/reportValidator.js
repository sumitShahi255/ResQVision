const { body, query } = require("express-validator");

const createReportValidation = [
  body("description").notEmpty().withMessage("Description is required"),
  body("disasterType")
    .isIn(["Flood", "Fire", "Cyclone", "Earthquake", "Landslide", "Building Collapse", "Road Block"])
    .withMessage("Invalid disaster type"),
  // Since we use FormData, location is a stringified JSON. We validate it exists here, and parse it in the controller.
  body("location").notEmpty().withMessage("Location coordinates are required")
];

const updateStatusValidation = [
  body("status")
    .isIn(["Pending AI Review", "Verified", "Team Assigned", "In Progress", "Resolved", "Fake"])
    .withMessage("Invalid status"),
];

const updateSeverityValidation = [
  body("severity")
    .isIn(["High", "Medium", "Low"])
    .withMessage("Invalid severity"),
  body("aiConfidence").optional().isNumeric(),
  body("aiVerified").optional().isBoolean(),
];

module.exports = {
  createReportValidation,
  updateStatusValidation,
  updateSeverityValidation
};
