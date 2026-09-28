const express = require("express");
const router = express.Router();
const {
  addResource,
  getResources,
  getNearbyResources,
  updateResource,
  deleteResource
} = require("../controllers/resourceController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validate } = require("../middleware/validate");
const { createResourceValidation, getNearbyValidation } = require("../validators/resourceValidator");

router.route("/")
  .post(protect, authorizeRoles("Admin"), createResourceValidation, validate, addResource)
  .get(getResources);

router.get("/nearby", getNearbyValidation, validate, getNearbyResources);

router.route("/:id")
  .put(protect, authorizeRoles("Admin"), updateResource)
  .delete(protect, authorizeRoles("Admin"), deleteResource);

module.exports = router;
