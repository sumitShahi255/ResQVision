const DisasterReport = require("../models/DisasterReport");

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

// @desc    Create a new report and verify via AI
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  try {
    const { description, disasterType, urgency, resourceNeeded } = req.body;
    
    // Parse location if it comes as string from form-data
    let location = req.body.location;
    if (typeof location === 'string') {
      location = JSON.parse(location);
    }

    // Default placeholder if no image
    let imageUrl = "https://placehold.co/600x400";
    let aiResponse = { verified: false, disasterType, severity: "Medium", confidence: 0, predictedResources: [] };

    if (req.file) {
      imageUrl = req.file.path; // Local path for now, Cloudinary later

      // Send image to Python AI Service
      try {
        const formData = new FormData();
        formData.append("file", fs.createReadStream(req.file.path));
        formData.append("reported_type", disasterType);

        const aiRes = await axios.post("http://127.0.0.1:5001/api/v1/predict", formData, {
          headers: { ...formData.getHeaders() }
        });
        
        aiResponse = aiRes.data;
      } catch (aiError) {
        console.error("AI Service Error:", aiError.message);
        // Continue saving report even if AI fails (Fallback)
      }
    }

    const report = await DisasterReport.create({
      userId: req.user._id,
      image: imageUrl,
      description,
      disasterType: aiResponse.disasterType,
      severity: aiResponse.severity,
      location,
      urgency: urgency || "Medium",
      resourceNeeded: resourceNeeded || [],
      aiConfidence: aiResponse.confidence,
      aiVerified: aiResponse.verified,
      predictedResources: aiResponse.predictedResources,
      status: "Pending AI Review"
    });
    
    // If verified successfully, automatically update status
    if (aiResponse.verified) {
      report.status = "Verified";
      await report.save();
    }

    // Emit socket event (prepare for real-time)
    const io = req.app.get("io");
    if (io) {
      io.emit("new_disaster", report);
    }

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reports (with filtering, sorting, pagination)
// @route   GET /api/reports
// @access  Public
const getReports = async (req, res) => {
  try {
    const { status, severity, disasterType, page = 1, limit = 20, sort } = req.query;
    let query = {};

    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (disasterType) query.disasterType = disasterType;

    let sortObj = { createdAt: -1 }; // Default sort latest
    if (sort === "severity") {
      sortObj = { severity: -1, createdAt: -1 };
    }

    const reports = await DisasterReport.find(query)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("userId", "name email");

    const total = await DisasterReport.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Reports fetched successfully",
      data: {
        reports,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged-in user's reports
// @route   GET /api/reports/my-reports
// @access  Private
const getMyReports = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const query = { userId: req.user._id };

    const reports = await DisasterReport.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await DisasterReport.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "My reports fetched successfully",
      data: {
        reports,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Public
const getReportById = async (req, res) => {
  try {
    const report = await DisasterReport.findById(req.params.id)
      .populate("userId", "name email mobile")
      .populate("assignedTeam", "teamName contact");

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.status(200).json({
      success: true,
      message: "Report fetched successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update report status
// @route   PATCH /api/reports/:id/status
// @access  Private (Admin)
const updateReportStatus = async (req, res) => {
  try {
    const report = await DisasterReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    report.status = req.body.status;
    await report.save();

    res.status(200).json({
      success: true,
      message: "Report status updated successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update report severity (AI verification simulation)
// @route   PATCH /api/reports/:id/severity
// @access  Private (Admin or AI Service)
const updateReportSeverity = async (req, res) => {
  try {
    const { severity, aiConfidence, aiVerified } = req.body;
    const report = await DisasterReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    report.severity = severity || report.severity;
    if (aiConfidence !== undefined) report.aiConfidence = aiConfidence;
    if (aiVerified !== undefined) report.aiVerified = aiVerified;

    await report.save();

    res.status(200).json({
      success: true,
      message: "Report severity updated successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private (Admin)
const deleteReport = async (req, res) => {
  try {
    const report = await DisasterReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: "Report removed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReport,
  getReports,
  getMyReports,
  getReportById,
  updateReportStatus,
  updateReportSeverity,
  deleteReport,
};
