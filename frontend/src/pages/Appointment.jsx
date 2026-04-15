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

  const handleBooking = () => {
    // Not logged in
    if (!isLoggedIn) {
      toast.error("Please login first to book appointment");
      navigate("/login");
      return;
    }

    // Not a student
    if (userData?.role !== "student") {
      toast.error("Only students can book appointments");
      return;
    }

    // No slot or resource selected
    if (!slotTime || !selectedResource) {
      toast.error("Please select resource and time slot");
      return;
    }

    // Proceed booking (later API call)
    toast.success("Booking successful (demo)");
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
          {serviceSlot[slotIndex]?.map((slot, index) => (
            <button
              key={index}
              className={`btn me-2 mb-2 rounded-pill ${
                slotTime === slot.time ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() => setSlotTime(slot.time)}
            >
              {slot.time}
            </button>
          ))}
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
