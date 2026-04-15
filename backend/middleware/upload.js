import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "campusease_uploads",
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/\s+/g, "_").replace(/\.[^/.]+$/, ""); 
      return `${timestamp}_${originalName}`;
    },
    resource_type: "auto", //allows images, pdf, docs, etc.
  },
});

const upload = multer({ storage });

export default upload;
