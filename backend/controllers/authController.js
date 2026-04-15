import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Signup
export const signup = async (req, res) => {
  const { fullname, role, email, password } = req.body;

  if (!fullname || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  if (!["student", "teacher", "admin"].includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role" });
  }

  try {
    // check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = new userModel({
      fullname,
      role,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // generate token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        name: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Signup failed" });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful!",
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update User Profile
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    let updatedData = { ...req.body };

    if (req.file) {
      updatedData.image = req.file.path;
    }

    // 🔹 Get existing user first
    const existingUser = await userModel.findById(id);

    if (!existingUser) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if anything actually changed
    const isSame =
      (!updatedData.fullname ||
        updatedData.fullname === existingUser.fullname) &&
      (!updatedData.email || updatedData.email === existingUser.email) &&
      (!updatedData.image || updatedData.image === existingUser.image);

    if (isSame) {
      return res.json({
        success: false,
        message: "No changes detected",
      });
    }

    // Update only if changed
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { $set: updatedData },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    res.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating user" });
  }
};

// Delete Account
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    //Check if requester is admin
    if (req.user.role !== "admin") {
      return res.json({
        success: false,
        message: "Only admin can delete users",
      });
    }

    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error deleting user" });
  }
};

// Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await userModel.find({ role: "teacher" },"fullname email role image").select("-password");

    res.json({
      success: true,
      teachers,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching teachers" });
  }
};

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await userModel.find({ role: "student" }).select("-password");

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching students" });
  }
};

// Get User By ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel
      .findById(id)
      .select("-password"); // hide password

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error fetching user",
    });
  }
};