import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  image:  { type: String, default:"https://www.pngmart.com/files/23/Profile-PNG-Photo.png"},
  category: {
    type: String,
    enum: [
      "academic",
      "administrative",
      "campus facility",
      "health & wellness",
      "hostel & housing",
    ],
    required: true,
  },
  details: {
    department: { type: String, default: null },
    location: { type: String, default: null },
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user",default: null},
});

const resourceModel =
  mongoose.models.resource || mongoose.model("resource", resourceSchema);

export default resourceModel;
