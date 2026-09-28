const Resource = require("../models/Resource");

// @desc    Add a new resource
// @route   POST /api/resources
// @access  Private (Admin)
const addResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);

    res.status(201).json({
      success: true,
      message: "Resource added successfully",
      data: resource,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get resources (with search, filter, pagination)
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
  try {
    const { search, type, page = 1, limit = 20 } = req.query;
    let query = {};

    if (type) query.type = type;
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const resources = await Resource.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Resource.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Resources fetched successfully",
      data: {
        resources,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get nearby resources using MongoDB Geospatial Query ($near)
// @route   GET /api/resources/nearby
// @access  Public
const getNearbyResources = async (req, res) => {
  try {
    const { lat, lng, type, maxDistance = 10 } = req.query; // maxDistance in km

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: "Please provide lat and lng" });
    }

    let query = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseFloat(maxDistance) * 1000 // Convert km to meters
        }
      }
    };

    if (type) query.type = type;

    const nearby = await Resource.find(query);

    // Format response to include a pseudo distance (if needed, otherwise just return the array)
    // MongoDB $near automatically sorts by nearest. 
    // To actually project the exact distance, we would use $geoNear aggregation, but $near is sufficient for now.
    
    res.status(200).json({
      success: true,
      message: "Nearby resources fetched successfully",
      data: nearby,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Private (Admin)
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    res.status(200).json({
      success: true,
      message: "Resource updated successfully",
      data: resource,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private (Admin)
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    await resource.deleteOne();

    res.status(200).json({
      success: true,
      message: "Resource removed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addResource,
  getResources,
  getNearbyResources,
  updateResource,
  deleteResource,
};
