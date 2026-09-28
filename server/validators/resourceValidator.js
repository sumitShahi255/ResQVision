const { body, query } = require("express-validator");

const createResourceValidation = [
  body("type")
    .isIn(["Hospital", "Shelter", "Food Camp", "Water Tank", "Ambulance", "Police", "NGO", "Fire Station"])
    .withMessage("Invalid resource type"),
  body("name").notEmpty().withMessage("Name is required"),
  body("contact").notEmpty().withMessage("Contact is required"),
  body("location.lat").isFloat({ min: -90, max: 90 }).withMessage("Valid latitude is required"),
  body("location.lng").isFloat({ min: -180, max: 180 }).withMessage("Valid longitude is required"),
  body("capacity").optional().isNumeric(),
  body("available").optional().isNumeric(),
];

const getNearbyValidation = [
  query("lat").isFloat({ min: -90, max: 90 }).withMessage("Valid latitude is required"),
  query("lng").isFloat({ min: -180, max: 180 }).withMessage("Valid longitude is required"),
];

module.exports = {
  createResourceValidation,
  getNearbyValidation
};
