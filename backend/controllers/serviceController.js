import serviceModel from "../models/serviceModel.js";

// Create Service
export const addService = async (req, res) => {
  try {
    let { name, category, description, resources } = req.body;

    //convert string → array
    if (resources) {
      if (typeof resources === "string") {
        resources = JSON.parse(resources);
      }
    } else {
      resources = [];
    }

    const service = new serviceModel({
      name,
      category,
      description,
      image: req.file ? req.file.path : undefined,
      resources,
    });

    await service.save();

    res.json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error creating service" });
  }
};

// Get All Services
export const getAllServices = async (req, res) => {
  try {
    const services = await serviceModel.find().populate("resources");
    res.json({ success: true, services });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching services" });
  }
};

// Get Services by Id
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await serviceModel.findById(id).populate("resources");

    if (!service) {
      return res.json({ success: false, message: "Service not found" });
    }

    res.json({ success: true, service });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching service" });
  }
};

// Update Services
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedData = { ...req.body };

    if (updatedData.resources && typeof updatedData.resources === "string") {
      updatedData.resources = JSON.parse(updatedData.resources);
    }

    if (req.file) {
      updatedData.image = req.file.path;
    }

    const service = await serviceModel.findByIdAndUpdate(
      id,
      { $set: updatedData },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!service) {
      return res.json({ success: false, message: "Service not found" });
    }

    res.json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating service" });
  }
};

// Add Resouces to Service
export const addResourceToService = async (req, res) => {
  try {
    const { id } = req.params;
    const { resourceId } = req.body;

    const service = await serviceModel
      .findByIdAndUpdate(
        id,
        { $addToSet: { resources: resourceId } },
        { returnDocument: "after" },
      )
      .populate("resources");

    if (!service) {
      return res.json({ success: false, message: "Service not found" });
    }

    res.json({
      success: true,
      message: "Resource added to service",
      service,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding resource" });
  }
};

// Delete Resources to Service
export const removeResourceFromService = async (req, res) => {
  try {
    const { id } = req.params;
    const { resourceId } = req.body;

    const service = await serviceModel.findByIdAndUpdate(
      id,
      { $pull: { resources: resourceId } },
      { returnDocument: "after" },
    );

    res.json({
      success: true,
      message: "Resource removed",
      service,
    });
  } catch (error) {
    res.json({ success: false, message: "Error removing resource" });
  }
};

// Delete Services
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await serviceModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.json({ success: false, message: "Service not found" });
    }

    res.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error deleting service" });
  }
};
