import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, default:"https://www.pngmart.com/files/23/Profile-PNG-Photo.png"},
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    required: true,
  },
  password: { type: String, required: true },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
