import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [activeTab, setActiveTab] = useState("summary");
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [bookingData, setBookingData] = useState({
    resourceId: "",
    appointmentDate: "",
    timeSlot: "",
    notes: "",
  });

  const menuItems = [
    { key: "summary", label: "Summary" },
    { key: "book", label: "Book Appointment" },
    { key: "appointments", label: "My Appointments" },
  ];

  const fetchServices = async () => {
    const res = await fetch(`${backendUrl}/api/service/get`, {
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) setServices(data.services);
  };

  const fetchAppointments = async () => {
    const res = await fetch(`${backendUrl}/api/appointment/my`, {
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) setAppointments(data.appointments);
  };

  useEffect(() => {
    fetchServices();
    fetchAppointments();
  }, []);

  const handleBookAppointment = async () => {
    try {
      const res = await fetch(
        `${backendUrl}/api/appointment/book/${selectedService._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(bookingData),
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        fetchAppointments();
        setActiveTab("appointments");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Booking failed");
    }
  };

  const cancelAppointment = async (id) => {
    const confirmCancel = window.confirm(
      "Cancelling will charge ₹50 penalty. Continue?",
    );

    if (!confirmCancel) return;

    try {
      const res = await fetch(`${backendUrl}/api/appointment/cancel/${id}`, {
        method: "PUT",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        fetchAppointments();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Cancel failed");
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#342516",
          color: "white",
        }}
        className="p-3"
      >
        <h4 className="mb-4 text-center">Student Panel</h4>

        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`p-2 mb-2 rounded ${
              activeTab === item.key ? "bg-light text-dark" : ""
            }`}
            style={{ cursor: "pointer" }}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="flex-grow-1 p-4 bg-light">
        {activeTab === "summary" && (
          <>
            <h3 className="mb-4">Dashboard Summary</h3>

            <div className="row">
              <div className="col-md-6">
                <div className="card shadow p-4 text-center">
                  <h5>Available Services</h5>
                  <h2>{services.length}</h2>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card shadow p-4 text-center">
                  <h5>My Appointments</h5>
                  <h2>{appointments.length}</h2>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "book" && (
          <>
            <h3 className="mb-4">Book Appointment</h3>

            <div className="row">
              {services.length > 0 ? (
                services.map((service) => (
                  <div className="col-md-4 mb-4" key={service._id}>
                    <div
                      className="card shadow border-0 h-100"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/appointment/${service._id}`)}
                    >
                      <img
                        src={service.image}
                        alt={service.name}
                        className="card-img-top"
                        style={{
                          height: "180px",
                          objectFit: "cover",
                        }}
                      />

                      <div className="card-body">
                        <h5 className="fw-bold">{service.name}</h5>
                        <p className="text-secondary">{service.category}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center mt-4">
                  <h5>No services available</h5>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "appointments" && (
          <>
            <h3 className="mb-4">My Appointments</h3>

            <div className="card shadow p-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Resource</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((item) => (
                    <tr key={item._id}>
                      <td>{item.serviceId?.name}</td>
                      <td>{item.resourceId?.name}</td>
                      <td>
                        {new Date(item.appointmentDate).toLocaleDateString()}
                      </td>
                      <td>{item.timeSlot}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === "pending"
                              ? "bg-secondary"
                              : item.status === "approved"
                                ? "bg-success-subtle text-success"
                                : item.status === "completed"
                                  ? "bg-success"
                                  : item.status === "cancelled"
                                    ? "bg-danger"
                                    : "bg-secondary"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        {item.status !== "cancelled" && item.status !== "completed" && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => cancelAppointment(item._id)}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
