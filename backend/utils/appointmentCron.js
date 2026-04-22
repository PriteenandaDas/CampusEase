import cron from "node-cron";
import appointmentModel from "../models/appointmentModel.js";

// Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("Appointment scheduler started...");
  try {
    const now = new Date();

    // Only check approved appointments
    const appointments = await appointmentModel
      .find({
        status: "approved",
      })
      .populate("resourceId");

    let completedCount = 0;

    for (const appt of appointments) {
      const resource = appt.resourceId;

      // Only for non-human resources
      if (
        resource &&
        !["teacher", "doctor", "staff"].includes(
          resource.type.toLowerCase()
        )
      ) {
        const slotDateTime = new Date(
          appt.appointmentDate
        );

        // Convert slot time
        const [time, period] =
          appt.timeSlot.split(" ");

        let [hours, minutes] = time
          .split(":")
          .map(Number);

        if (period === "PM" && hours !== 12) {
          hours += 12;
        }

        if (period === "AM" && hours === 12) {
          hours = 0;
        }

        slotDateTime.setHours(
          hours,
          minutes,
          0,
          0
        );

        // Time passed → complete
        if (now > slotDateTime) {
          appt.status = "completed";
          await appt.save();
          completedCount++;
        }
      }
    }

    console.log(
      `Auto-completed ${completedCount} non-human appointments`
    );
  } catch (error) {
    console.error("Cron error:", error);
  }
});