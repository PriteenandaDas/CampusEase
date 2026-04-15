import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },

  image: {
    type: String,
    default: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
  },

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

  description: { type: String, required: true },

  resources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resource", 
    },
  ],
});

const serviceModel =
  mongoose.models.service || mongoose.model("service", serviceSchema);

export default serviceModel;