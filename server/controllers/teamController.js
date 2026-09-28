const RescueTeam = require("../models/RescueTeam");
const DisasterReport = require("../models/DisasterReport");

// @desc    Add a new rescue team
// @route   POST /api/teams
// @access  Private (Admin)
const addTeam = async (req, res) => {
  try {
    const team = await RescueTeam.create(req.body);

    res.status(201).json({
      success: true,
      message: "Rescue team added successfully",
      data: team,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all rescue teams (with search)
// @route   GET /api/teams
// @access  Private (Admin, RescueTeam)
const getTeams = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.teamName = { $regex: search, $options: "i" };
    }

    const teams = await RescueTeam.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Rescue teams fetched successfully",
      data: teams,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get team by ID
// @route   GET /api/teams/:id
// @access  Private
const getTeamById = async (req, res) => {
  try {
    const team = await RescueTeam.findById(req.params.id)
      .populate("assignedReports", "disasterType location status urgency severity");

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    res.status(200).json({
      success: true,
      message: "Team fetched successfully",
      data: team,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update team status
// @route   PATCH /api/teams/:id/status
// @access  Private
const updateTeamStatus = async (req, res) => {
  try {
    const team = await RescueTeam.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    team.status = req.body.status;
    await team.save();

    res.status(200).json({
      success: true,
      message: "Team status updated successfully",
      data: team,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign a team to a report
// @route   POST /api/teams/:id/assign
// @access  Private (Admin)
const assignTeam = async (req, res) => {
  try {
    const { reportId } = req.body;
    
    const team = await RescueTeam.findById(req.params.id);
    const report = await DisasterReport.findById(reportId);

    if (!team || !report) {
      return res.status(404).json({ success: false, message: "Team or Report not found" });
    }

    // Assign report to team
    if (!team.assignedReports.includes(reportId)) {
      team.assignedReports.push(reportId);
      team.status = "On Mission";
      await team.save();
    }

    // Assign team to report
    report.assignedTeam = team._id;
    report.status = "Assigned";
    await report.save();

    res.status(200).json({
      success: true,
      message: "Team assigned to report successfully",
      data: { team, report },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addTeam,
  getTeams,
  getTeamById,
  updateTeamStatus,
  assignTeam,
};
