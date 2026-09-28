const express = require("express");
const router = express.Router();
const { getUsers, updateUser } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.route("/users")
  .get(protect, authorizeRoles("Admin"), getUsers);

router.route("/users/:id")
  .put(protect, authorizeRoles("Admin"), updateUser);

module.exports = router;
