import React, { useEffect, useState, useContext } from "react";
import { ServiceContext } from "../context/ServiceContext";
import { useParams,useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Appointment = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const { serviceData } = useContext(ServiceContext);
  const { isLoggedIn, userData } = useContext(AppContext);

  const dayOfWeek = ["SUN", "MON", "TUES", "WED", "THUR", "FRI", "SAT"];

  const [serviceInfo, setServiceInfo] = useState(null);
  const [serviceSlot, setServiceSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [selectedResource, setSelectedResource] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  // ✅ FETCH SERVICE (FIXED _id)
  const fetchServiceInfo = () => {
    const service = serviceData.find((service) => service._id === serviceId);
    setServiceInfo(service);
  };

  // ✅ SLOT GENERATION (same logic)
  const getAvailableSlots = () => {
    let today = new Date();
    let allSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        if (currentDate.getMinutes() > 30) {
          currentDate.setHours(currentDate.getHours() + 2);
          currentDate.setMinutes(0);
        } else {
          currentDate.setHours(currentDate.getHours() + 1);
          currentDate.setMinutes(0);
        }

        if (currentDate.getHours() < 10) {
          currentDate.setHours(10, 0, 0, 0);
        }
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        currentDate.setMinutes(currentDate.getMinutes() + 60);
      }

      allSlots.push(timeSlots);
    }

    setServiceSlot(allSlots);
  };

  useEffect(() => {
    fetchServiceInfo();
  }, [serviceData, serviceId]);

  useEffect(() => {
    if (serviceInfo) getAvailableSlots();
  }, [serviceInfo]);

  useEffect(() => {
  if (selectedResource) {
    fetchBookedSlots();
  }
}, [selectedResource, slotIndex]);

 const handleBooking = async () => {
  try {
    // Not logged in
    if (!isLoggedIn) {
      toast.error("Please login first to book appointment");
      navigate("/login");
      return;
    }

    // Only students can book
    if (userData?.role !== "student") {
      toast.error("Only students can book appointments");
      return;
    }

    // Validation
    if (!selectedResource) {
      toast.error("Please select a resource");
      return;
    }

    if (!slotTime) {
      toast.error("Please select a time slot");
      return;
    }

    // Get selected date
    const selectedDate =
      serviceSlot[slotIndex]?.[0]?.datetime;

    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    const appointmentData = {
      resourceId: selectedResource._id,
      appointmentDate: selectedDate.toISOString(),
      timeSlot: slotTime,
      notes: `Appointment for ${serviceInfo.name}`,
    };

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/appointment/book/${serviceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(appointmentData),
      }
    );

    const data = await res.json();

    if (data.success) {
      toast.success(data.message);

      fetchBookedSlots();

      // reset selection
      setSelectedResource(null);
      setSlotTime("");

      // optional redirect
      navigate("/student-dashboard");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Booking failed");
  }
};

const fetchBookedSlots = async () => {
  try {
    if (!selectedResource) return;

    const selectedDate =
      serviceSlot[slotIndex]?.[0]?.datetime;

    if (!selectedDate) return;

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/appointment/booked-slots?resourceId=${selectedResource._id}&date=${selectedDate.toISOString()}`,
      {
        credentials: "include",
      }
    );

    const data = await res.json();

    if (data.success) {
      setBookedSlots(data.bookedSlots);
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="container my-5">
      {/* SERVICE INFO */}
      <div className="row align-items-center mb-4">
        <div className="col-md-4 text-center mb-3 mb-md-0">
          <img
            src={serviceInfo?.image}
            alt={serviceInfo?.name}
            className="img-fluid rounded shadow"
            style={{ maxHeight: "250px", objectFit: "cover" }}
          />
        </div>

        <div className="col-md-8">
          <h2 className="fw-bold mb-3" style={{ color: "#4b2e2e" }}>
            {serviceInfo?.name}
          </h2>
          <p className="text-secondary mb-2">{serviceInfo?.category}</p>

          {/* ✅ FIXED (description instead of about) */}
          <p className="mb-3">{serviceInfo?.description}</p>
        </div>
      </div>

      {/* RESOURCES SECTION */}
      {serviceInfo?.resources?.length > 0 && (
        <div className="mb-5 text-center">
          <h4 className="fw-bold mb-4">Available Resources</h4>

          <div className="d-flex flex-wrap justify-content-center gap-4">
            {serviceInfo.resources.map((res) => (
              <div
                key={res._id}
                onClick={() => setSelectedResource(res)}
                className={`card shadow-sm p-2 cursor-pointer ${
                  selectedResource?._id === res._id
                    ? "border border-3 border-primary"
                    : ""
                }`}
                style={{
                  width: "180px",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
              >
                <img
                  src={res.image}
                  alt={res.name}
                  className="card-img-top"
                  style={{ height: "120px", objectFit: "cover" }}
                />

                <div className="card-body text-center">
                  <h6 className="fw-bold">{res.name}</h6>
                  <p className="text-muted small mb-0">{res.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOOKING SECTION */}
      <div className="mt-4 fw-medium text-secondary px-sm-4 d-flex flex-column align-items-center">
        <p className="mb-3">Booking Slot</p>

        {/* DATE */}
        <div className="d-flex gap-3 overflow-auto mt-3">
          {serviceSlot.map((item, index) => {
            const dateObj = item[0]?.datetime;
            if (!dateObj) return null;

            return (
              <div
                key={index}
                className={`border rounded-circle d-flex flex-column justify-content-center align-items-center cursor-pointer ${
                  slotIndex === index ? "bg-dark text-white" : ""
                }`}
                style={{ width: "80px", height: "80px" }}
                onClick={() => setSlotIndex(index)}
              >
                <p className="mb-0 fw-bold">{dayOfWeek[dateObj.getDay()]}</p>
                <p className="mb-0">{dateObj.getDate()}</p>
              </div>
            );
          })}
        </div>

        {/* TIME */}
        <div className="d-flex flex-wrap justify-content-center mt-4">
         {serviceSlot[slotIndex]?.map((slot, index) => {
  const isBooked = bookedSlots.includes(slot.time);

  return (
    <button
      key={index}
      disabled={isBooked}
      className={`btn me-2 mb-2 rounded-pill ${
        isBooked
          ? "btn-danger disabled"
          : slotTime === slot.time
          ? "btn-primary"
          : "btn-outline-secondary"
      }`}
      onClick={() => !isBooked && setSlotTime(slot.time)}
    >
      {slot.time}
    </button>
  );
})}
        </div>

        {/* BOOK BUTTON */}
        <div className="mt-4">
          <button
            onClick={handleBooking}
            className="btn btn-lg px-4 py-2"
            style={{ background: "#342516", color: "white" }}
          >
            Book an appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
