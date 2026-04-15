import express from "express";
import {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
} from "../controllers/resourceController.js";
import upload from "../middleware/upload.js";

const resourceRouter = express.Router();

resourceRouter.post("/add",upload.single('image'),createResource);
resourceRouter.get("/get", getAllResources);
resourceRouter.get("/get-by-id/:id", getResourceById);
resourceRouter.put("/update/:id",upload.single('image'), updateResource);
resourceRouter.delete("/delete/:id", deleteResource);

export default resourceRouter;