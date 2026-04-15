import express from "express";
import {
  login,
  logout,
  signup,
  getProfile,
  updateUser,
  deleteUser,
  getAllTeachers,
  getAllStudents,
  getUserById
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";
import upload from "../middleware/upload.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/profile", userAuth, getProfile);
authRouter.put("/update/:id", upload.single("image"), updateUser);
authRouter.delete("/delete/:id", userAuth, deleteUser);
authRouter.get("/teachers", userAuth, getAllTeachers);
authRouter.get("/students", userAuth, getAllStudents);
authRouter.get("/get-by-id/:id", userAuth, getUserById);

export default authRouter;
