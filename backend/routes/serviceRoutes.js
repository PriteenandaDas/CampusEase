import express from "express";
import {
  addService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  addResourceToService,
  removeResourceFromService,
} from "../controllers/serviceController.js";

import upload from "../middleware/upload.js"; 

const serviceRouter = express.Router();


serviceRouter.post("/add", upload.single("image"), addService);
serviceRouter.get("/get", getAllServices);
serviceRouter.get("/get-by-id/:id", getServiceById);
serviceRouter.put("/update/:id", upload.single("image"), updateService);
serviceRouter.put("/add-resource/:id", addResourceToService);
serviceRouter.delete("/delete/:id", deleteService);
serviceRouter.delete("/remove-resource/:id", removeResourceFromService);

export default serviceRouter;