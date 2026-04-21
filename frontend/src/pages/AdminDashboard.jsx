import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [services, setServices] = useState([]);
  const [resources, setResources] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const latestBookings = appointments.slice(0, 5);

  // Sidebar Menu
  const menuItems = [
    { key: "summary", label: "Summary" },
    { key: "services", label: "Manage Services" },
    { key: "resources", label: "Manage Resources" },
    { key: "appointments", label: "Appointments" },
    { key: "students", label: "Student List" },
    { key: "teachers", label: "Teacher List" },
  ];

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/user/students`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setStudents(data.students);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/user/teachers`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setTeachers(data.teachers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/service/get`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setServices(data.services);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/resource/get`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setResources(data.resources);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/appointment/all`, {
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        // latest first
        const sortedAppointments = data.appointments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setAppointments(sortedAppointments);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
    fetchServices();
    fetchResources();
    fetchAppointments();
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#342516",
          color: "white",
          flexShrink: 0,
        }}
        className="p-3"
      >
        <h4 className="mb-4 text-center">Admin Panel</h4>

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

      {/* Right Content */}
      <div className="flex-grow-1 p-4 bg-light" style={{ overflowX: "hidden" }}>
        {/* SUMMARY */}
        {activeTab === "summary" && (
          <>
            <h3 className="mb-4" style={{ color: "#4b2e2e" }}>
              Dashboard Summary
            </h3>

            {/* Cards */}
            <div className="row mb-4">
              {[
                { label: "Students", value: students.length },
                { label: "Teachers", value: teachers.length },
                { label: "Services", value: services.length },
                { label: "Resources", value: resources.length },
              ].map((item, index) => (
                <div className="col-md-3 mb-3" key={index}>
                  <div className="card shadow text-center p-3">
                    <h5>{item.label}</h5>
                    <h3 style={{ color: "#342516" }}>{item.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Latest Bookings */}
            <div className="card shadow p-3">
              <h5 className="mb-3">Latest Bookings</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {latestBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.studentId?.fullname}</td>
                      <td>{booking.serviceId?.name}</td>
                      <td>
                        {new Date(booking.appointmentDate).toLocaleDateString()}
                      </td>
                      <td>{booking.timeSlot}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* OTHER SECTIONS */}
        {activeTab === "services" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Services List</h3>

              <button
                className="btn text-white"
                style={{ background: "#342516" }}
                onClick={() => navigate("/admin-dashboard/add-service")}
              >
                + Add New Services
              </button>
            </div>
            <div className="row mt-4">
              {services.map((t) => (
                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={t._id}>
                  <div
                    className="card shadow text-center p-3 hover-card"
                    onClick={() =>
                      navigate(`/admin-dashboard/service/${t._id}`)
                    }
                  >
                    <img
                      src={t.image}
                      alt={t.name}
                      className="mb-3"
                      style={{
                        width: "100%",
                        height: "160px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                    <h6 className="mt-2">{t.name}</h6>
                    <h6 className="mt-2">{t.category}</h6>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {activeTab === "resources" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Resources List</h3>

              <button
                className="btn text-white"
                style={{ background: "#342516" }}
                onClick={() => navigate("/admin-dashboard/add-resource")}
              >
                + Add New Resource
              </button>
            </div>
            <div className="row mt-4">
              {resources.map((t) => (
                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={t._id}>
                  <div
                    className="card shadow text-center p-3 hover-card"
                    onClick={() =>
                      navigate(`/admin-dashboard/resource/${t._id}`)
                    }
                  >
                    <img
                      src={t.image}
                      alt={t.name}
                      className="mb-3"
                      style={{
                        width: "100%",
                        height: "160px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                    <h6 className="mt-2">{t.name}</h6>
                    <h6 className="mt-2">{t.category}</h6>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {activeTab === "appointments" && (
          <>
            <h3 className="mb-4">All Appointments</h3>

            <div className="card shadow p-3">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Service</th>
                    <th>Resource</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((appt) => (
                      <tr key={appt._id}>
                        <td>{appt.studentId?.fullname}</td>
                        <td>{appt.serviceId?.name}</td>
                        <td>{appt.resourceId?.name}</td>
                        <td>
                          {new Date(appt.appointmentDate).toLocaleDateString()}
                        </td>
                        <td>{appt.timeSlot}</td>
                        <td>
                          <span
                            className={`badge ${
                              appt.status === "pending"
                                ? "bg-secondary"
                                : appt.status === "approved"
                                  ? "bg-success-subtle text-success"
                                  : appt.status === "completed"
                                    ? "bg-success"
                                    : appt.status === "cancelled"
                                      ? "bg-danger"
                                      : "bg-secondary"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No appointments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
        {activeTab === "students" && (
          <>
            <h3>Student List</h3>
            <div className="row mt-3">
              {students.map((s) => (
                <div className="col-md-3 mb-4" key={s._id}>
                  <div className="card shadow text-center p-3 hover-card">
                    <img
                      src={s.image}
                      alt={s.fullname}
                      className="mb-2"
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                    <h6 className="mt-2">{s.fullname}</h6>
                    <h6 className="mt-2">{s.email}</h6>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {activeTab === "teachers" && (
          <>
            <h3>Teacher List</h3>
            <div className="row mt-3">
              {teachers.map((t) => (
                <div className="col-md-3 mb-4" key={t._id}>
                  <div className="card shadow text-center p-3 hover-card">
                    <img
                      src={t.image}
                      alt={t.fullname}
                      className="mb-2"
                      style={{
                        width: "100%",
                        height: "160px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                    <h6 className="mt-2">{t.fullname}</h6>
                    <h6 className="mt-2">{t.email}</h6>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
