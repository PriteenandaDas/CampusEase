import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import authRouter from "./routes/authRoutes.js";
import resourceRouter from "./routes/resourceRoutes.js";
import serviceRouter from "./routes/serviceRoutes.js";
import appointmentRouter from "./routes/appointmentRoutes.js";

//app config
const app = express();
const port = process.env.PORT || 5001;
connectDB();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

//api end points
app.get("/", (req, res) => {
  res.send("API is working");
});
app.use("/api/user", authRouter);
app.use("/api/resource", resourceRouter);
app.use("/api/service", serviceRouter);
app.use("/api/appointment", appointmentRouter);

app.listen(port, () => {
  console.log(`server is started on the port http://localhost:${port}`);
});
