const express = require("express");
const router = express.Router();
const {
  addTeam,
  getTeams,
  getTeamById,
  updateTeamStatus,
  assignTeam
} = require("../controllers/teamController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validate } = require("../middleware/validate");
const { createTeamValidation, updateStatusValidation, assignTeamValidation } = require("../validators/teamValidator");

router.route("/")
  .post(protect, authorizeRoles("Admin"), createTeamValidation, validate, addTeam)
  .get(protect, authorizeRoles("Admin", "RescueTeam"), getTeams);

router.get("/:id", protect, authorizeRoles("Admin", "RescueTeam"), getTeamById);

router.patch("/:id/status", protect, authorizeRoles("Admin", "RescueTeam"), updateStatusValidation, validate, updateTeamStatus);

router.post("/:id/assign", protect, authorizeRoles("Admin"), assignTeamValidation, validate, assignTeam);

module.exports = router;
