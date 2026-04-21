import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
      required: true,
    },

    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resource",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    timeSlot: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "completed", "cancelled"],
      default: "pending",
    },

     cancellationPenalty: {
      type: Number,
      default: 0,
    },

    compensationPaidTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
  },
  { timestamps: true }
);

const appointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;