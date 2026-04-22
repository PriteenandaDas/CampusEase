import appointmentModel from "../models/appointmentModel.js";
import resourceModel from "../models/resourceModel.js";
import userModel from "../models/userModel.js";

//Book Appointment
export const createAppointment = async (req, res) => {
  try {
    const {
      resourceId,
      appointmentDate,
      timeSlot,
    } = req.body;

    const serviceId = req.params.id;

    const studentId = req.user.id;

    const resource = await resourceModel.findById(resourceId);

let initialStatus = "pending";
if (resource && !["teacher","doctor","staff"].includes(resource.type.toLowerCase())) {
  initialStatus = "approved"; // auto approve for non-human resources
}

    if (!serviceId || !resourceId || !appointmentDate || !timeSlot) {
      return res.json({
        success: false,
        message: "Required fields missing",
      });
    }

    //Convert date properly
    const date = new Date(appointmentDate);

    //Check duplicate booking
    const existingAppointment = await appointmentModel.findOne({
      resourceId,
      appointmentDate: date,
      timeSlot,
      status: { $ne: "cancelled" }, // ignore cancelled bookings
    });

    if (existingAppointment) {
      return res.json({
        success: false,
        message: "This time slot is already booked for this resource",
      });
    }

    const appointment = new appointmentModel({
      studentId,
      serviceId,
      resourceId,
      appointmentDate,
      timeSlot,
      status: initialStatus,
    });

    await appointment.save();

    res.json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error booking appointment",
    });
  }
};

//Get All the Appointment
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find()
      .populate("studentId", "fullname email")
      .populate("serviceId", "name category")
      .populate("resourceId", "name type");

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error fetching appointments",
    });
  }
};

//Get Student's Appointment
export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await appointmentModel
      .find({ studentId: userId })
      .populate("serviceId", "name category")
      .populate("resourceId", "name type");

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error fetching appointments",
    });
  }
};

//Get Teacher's Appointment
export const getTeacherAppointments = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // find all resources assigned to teacher
    const resources = await resourceModel.find({
      userId: teacherId,
    });

    const resourceIds = resources.map((r) => r._id);

    const appointments = await appointmentModel
      .find({
        resourceId: { $in: resourceIds },
      })
      .populate("studentId", "fullname email")
      .populate("serviceId", "name category")
      .populate("resourceId", "name");

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error fetching teacher appointments",
    });
  }
};

//Update the Booking Status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await appointmentModel.findById(id);

    if (!appointment) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }

    const currentStatus = appointment.status;

    // Allowed transitions
    const allowedTransitions = {
      pending: ["approved", "cancelled"],
      approved: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };

    if (!allowedTransitions[currentStatus].includes(status)) {
      return res.json({
        success: false,
        message: `Cannot change status from ${currentStatus} to ${status}`,
      });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error updating status",
    });
  }
};

//Cancel Appointment(Student)
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    const appointment = await appointmentModel
      .findById(id)
      .populate("resourceId");

    if (!appointment) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.studentId.toString() !== studentId) {
      return res.json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (appointment.status === "cancelled") {
      return res.json({
        success: false,
        message: "Already cancelled",
      });
    }

    const teacherId = appointment.resourceId.userId;

    if (teacherId) {
      await userModel.findByIdAndUpdate(
        teacherId,
        { $inc: { walletBalance: 50 } }
      );
    }

    appointment.status = "cancelled";
    appointment.cancellationPenalty = 50;
    appointment.compensationPaidTo = teacherId;

    await appointment.save();

    res.json({
      success: true,
      message: "Appointment cancelled. ₹50 penalty charged.",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error cancelling appointment",
    });
  }
};

//Get the Already Booked Slots
export const getBookedSlots = async (req, res) => {
  try {
    const { resourceId, date } = req.query;

    if (!resourceId || !date) {
      return res.json({
        success: false,
        message: "resourceId and date required",
      });
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const appointments = await appointmentModel.find({
      resourceId,
      appointmentDate: {
        $gte: selectedDate,
        $lt: nextDate,
      },
      status: { $nin: ["cancelled", "completed"] },
    });

    const bookedSlots = appointments.map(
      (appt) => appt.timeSlot
    );

    res.json({
      success: true,
      bookedSlots,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error fetching booked slots",
    });
  }
};

//Get the teacher Earning
export const getTeacherEarnings = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const teacher = await userModel.findById(teacherId);

    res.json({
      success: true,
      earnings: teacher.walletBalance || 0,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error fetching earnings",
    });
  }
};