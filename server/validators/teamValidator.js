const { body } = require("express-validator");

const createTeamValidation = [
  body("teamName").notEmpty().withMessage("Team name is required"),
  body("leaderName").notEmpty().withMessage("Leader name is required"),
  body("contact").notEmpty().withMessage("Contact is required"),
];

const assignTeamValidation = [
  body("reportId").isMongoId().withMessage("Valid report ID is required"),
];

const updateStatusValidation = [
  body("status")
    .isIn(["Available", "On Mission", "Offline"])
    .withMessage("Invalid status"),
];

module.exports = {
  createTeamValidation,
  assignTeamValidation,
  updateStatusValidation
};
