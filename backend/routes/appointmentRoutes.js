import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getMyAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getTeacherAppointments,
  getTeacherEarnings,
  getBookedSlots,
} from "../controllers/appointmentController.js";

import userAuth from "../middleware/userAuth.js";

const appointmentRouter = express.Router();

appointmentRouter.post("/book/:id", userAuth, createAppointment);

appointmentRouter.get("/all", userAuth, getAllAppointments);

appointmentRouter.get("/my", userAuth, getMyAppointments);

appointmentRouter.put("/update-status/:id", userAuth, updateAppointmentStatus);

appointmentRouter.put("/cancel/:id",userAuth,cancelAppointment);

appointmentRouter.get("/teacher",userAuth,getTeacherAppointments);

appointmentRouter.get("/teacher/earnings",userAuth,getTeacherEarnings);

appointmentRouter.get("/booked-slots",userAuth,getBookedSlots);

export default appointmentRouter;