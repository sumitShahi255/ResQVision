const express = require("express");
const router = express.Router();
const {
  createReport,
  getReports,
  getMyReports,
  getReportById,
  updateReportStatus,
  updateReportSeverity,
  deleteReport
} = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validate } = require("../middleware/validate");
const { createReportValidation, updateStatusValidation, updateSeverityValidation } = require("../validators/reportValidator");
const upload = require("../middleware/uploadMiddleware");

router.route("/")
  .post(protect, upload.single("image"), createReportValidation, validate, createReport)
  .get(getReports);

router.get("/my-reports", protect, getMyReports);

router.route("/:id")
  .get(getReportById)
  .delete(protect, authorizeRoles("Admin"), deleteReport);

router.patch("/:id/status", protect, authorizeRoles("Admin"), updateStatusValidation, validate, updateReportStatus);
router.patch("/:id/severity", protect, authorizeRoles("Admin"), updateSeverityValidation, validate, updateReportSeverity);

module.exports = router;
