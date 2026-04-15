import resourceModel from "../models/resourceModel.js";

// Create Resources
export const createResource = async (req, res) => {
  try {
    const { type, name, category, location, department, userId } = req.body;

    if (!type || !name || !category) {
      return res.json({ success: false, message: "Required fields missing" });
    }

    const resource = new resourceModel({
      type,
      name,
      category,
      details: {
        location: location || null,
        department: department || null,
      },
      userId: ["teacher", "doctor", "staff"].includes(type.toLowerCase())
        ? userId || null
        : null,
      image: req.file ? req.file.path : undefined, //Cloudinary URL directly
    });

    await resource.save();

    res.json({
      success: true,
      message: "Resource created successfully",
      resource,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error creating resource" });
  }
};

// Get All Details
export const getAllResources = async (req, res) => {
  try {
    const resources = await resourceModel.find().populate("userId", "email role");
    res.json({ success: true, resources });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching resources" });
  }
};

// Get Details by Id
export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await resourceModel.findById(id).populate("userId", "email role");

    if (!resource) {
      return res.json({ success: false, message: "Resource not found" });
    }

    res.json({ success: true, resource });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching resource" });
  }
};

// Update Resources
export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;

    let updateFields = {};

    // Basic fields
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.type) updateFields.type = req.body.type;
    if (req.body.category) updateFields.category = req.body.category;

    // Image
    if (req.file) {
      updateFields.image = req.file.path;
    }

    //Details
    if (req.body.location || req.body.department) {
      updateFields.details = {
        location: req.body.location || null,
        department: req.body.department || null,
      };
    }

    //userId update
    if (
      req.body.type &&
      ["teacher", "doctor", "staff"].includes(req.body.type.toLowerCase())
    ) {
      updateFields.userId = req.body.userId || null;
    } else {
      updateFields.userId = null;
    }

    const updatedResource = await resourceModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedResource) {
      return res.json({ success: false, message: "Resource not found" });
    }

    res.json({
      success: true,
      message: "Resource updated successfully",
      resource: updatedResource,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating resource" });
  }
};

// Delete Resources
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await resourceModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.json({ success: false, message: "Resource not found" });
    }

    res.json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error deleting resource" });
  }
};
